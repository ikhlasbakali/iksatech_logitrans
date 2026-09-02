<?php

namespace App\Http\Controllers;

use App\Models\OperationEvent;
use App\Http\Requests\StoreOperationEventRequest;
use App\Http\Resources\OperationEventResource;
use App\Support\AccessScope;
use Illuminate\Http\Request;

class OperationEventController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', OperationEvent::class);

        $query = OperationEvent::with('operation', 'actorUser');

        if ($request->user()->hasAnyRole(['client', 'driver'])) {
            $query->whereHas('operation', function ($operationQuery) use ($request) {
                AccessScope::scopeOperations($operationQuery, $request->user());
            });
        }

        return OperationEventResource::collection($query->get());
    }

    public function store(StoreOperationEventRequest $request)
    {
        $this->authorize('create', OperationEvent::class);

        $event = OperationEvent::create($request->validated());

        return new OperationEventResource($event);
    }

    public function show(OperationEvent $operationEvent)
    {
        $this->authorize('view', $operationEvent);

        return new OperationEventResource($operationEvent->load('operation', 'actorUser'));
    }

    public function update(Request $request, OperationEvent $operationEvent)
    {
        $this->authorize('update', $operationEvent);

        $operationEvent->update($request->all());

        return new OperationEventResource($operationEvent);
    }

    public function destroy(OperationEvent $operationEvent)
    {
        $this->authorize('delete', $operationEvent);

        $operationEvent->delete();

        return response()->json(['message' => 'Evenement supprime.']);
    }
}
