<?php

namespace App\Http\Controllers;

use App\Models\Operation;
use App\Models\OperationEvent;
use App\Http\Requests\StoreOperationRequest;
use App\Http\Resources\OperationResource;
use Illuminate\Http\Request;

class OperationController extends Controller
{
    public function index()
    {
        return OperationResource::collection(
            Operation::with('client', 'driver1', 'driver2', 'vehicle', 'assignedAgent')->get()
        );
    }

    public function store(StoreOperationRequest $request)
    {
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
        return new OperationResource(
            $operation->load('client', 'driver1', 'driver2', 'vehicle', 'assignedAgent', 'events')
        );
    }

    public function update(Request $request, Operation $operation)
    {
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
        $operation->delete();
        return response()->json(['message' => 'Operation supprimee.']);
    }
}