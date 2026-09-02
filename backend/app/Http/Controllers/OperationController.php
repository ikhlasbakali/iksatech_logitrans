<?php

namespace App\Http\Controllers;

use App\Models\Operation;
use App\Models\OperationEvent;
use App\Http\Requests\StoreOperationRequest;
use App\Http\Resources\OperationResource;
use App\Support\AccessScope;
use Illuminate\Http\Request;

class OperationController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Operation::class);

        $query = Operation::with('client', 'driver1', 'driver2', 'vehicle', 'assignedAgent');
        AccessScope::scopeOperations($query, $request->user());

        return OperationResource::collection($query->get());
    }

    public function store(StoreOperationRequest $request)
    {
        $this->authorize('create', Operation::class);

        $operation = Operation::create($request->validated());

        OperationEvent::create([
            'operation_id' => $operation->id,
            'type' => 'created',
            'title' => 'Operation creee',
            'actor' => $request->user()->id,
        ]);

        return new OperationResource($operation);
    }

    public function show(Operation $operation)
    {
        $this->authorize('view', $operation);

        return new OperationResource(
            $operation->load('client', 'driver1', 'driver2', 'vehicle', 'assignedAgent', 'events')
        );
    }

    public function update(Request $request, Operation $operation)
    {
        $this->authorize('update', $operation);

        if ($request->user()->hasRole('driver')) {
            $operation->update($request->only([
                'current_lat',
                'current_lng',
                'status',
                'actual_pickup',
                'actual_delivery',
            ]));

            return new OperationResource($operation);
        }

        if ($request->has('status') && $request->status !== $operation->status) {
            if (!$operation->canTransitionTo($request->status)) {
                return response()->json([
                    'message' => "Transition invalide : impossible de passer de '{$operation->status}' a '{$request->status}'.",
                ], 422);
            }

            $previousStatus = $operation->status;

            $operation->update(array_merge($request->all(), [
                'previous_status' => $previousStatus,
            ]));

            OperationEvent::create([
                'operation_id' => $operation->id,
                'type' => 'status_change',
                'title' => "Statut change : {$previousStatus} vers {$request->status}",
                'actor' => $request->user()->id,
            ]);

            return new OperationResource($operation);
        }

        $operation->update($request->all());

        return new OperationResource($operation);
    }

    public function destroy(Operation $operation)
    {
        $this->authorize('delete', $operation);

        $operation->delete();

        return response()->json(['message' => 'Operation supprimee.']);
    }
}
