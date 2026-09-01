<?php

namespace App\Http\Controllers;

use App\Models\OperationEvent;
use App\Http\Requests\StoreOperationEventRequest;
use App\Http\Resources\OperationEventResource;
use Illuminate\Http\Request;

class OperationEventController extends Controller
{
    public function index()
    {
        return OperationEventResource::collection(
            OperationEvent::with('operation', 'actorUser')->get()
        );
    }

    public function store(StoreOperationEventRequest $request)
    {
        $event = OperationEvent::create($request->validated());
        return new OperationEventResource($event);
    }

    public function show(OperationEvent $operationEvent)
    {
        return new OperationEventResource($operationEvent->load('operation', 'actorUser'));
    }

    public function update(Request $request, OperationEvent $operationEvent)
    {
        $operationEvent->update($request->all());
        return new OperationEventResource($operationEvent);
    }

    public function destroy(OperationEvent $operationEvent)
    {
        $operationEvent->delete();
        return response()->json(['message' => 'Evenement supprime.']);
    }
}