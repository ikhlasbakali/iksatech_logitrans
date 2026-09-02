<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomsCheckpointRequest;
use App\Http\Requests\UpdateCustomsCheckpointRequest;
use App\Http\Resources\CustomsCheckpointResource;
use App\Models\CustomsCheckpoint;
use App\Models\OperationEvent;
use Illuminate\Http\Request;

class CustomsCheckpointController extends Controller
{
    public function index(Request $request)
    {
        $query = CustomsCheckpoint::with('operation');

        if ($request->filled('operation_id')) {
            $query->where('operation_id', $request->integer('operation_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return CustomsCheckpointResource::collection(
            $query->orderBy('sequence_order')->get()
        );
    }

    public function store(StoreCustomsCheckpointRequest $request)
    {
        $data = $request->validated();
        $data['status'] = $data['status'] ?? 'pending';

        $checkpoint = CustomsCheckpoint::create($data);

        return (new CustomsCheckpointResource($checkpoint->load('operation')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(CustomsCheckpoint $customsCheckpoint)
    {
        return new CustomsCheckpointResource($customsCheckpoint->load('operation'));
    }

    public function update(UpdateCustomsCheckpointRequest $request, CustomsCheckpoint $customsCheckpoint)
    {
        $data = $request->validated();
        $previousStatus = $customsCheckpoint->status;

        if (
            isset($data['status']) &&
            $data['status'] === 'arrived' &&
            $previousStatus !== 'arrived'
        ) {
            $data['arrived_at'] = $data['arrived_at'] ?? now();
            $data['arrived_by_name'] = $data['arrived_by_name'] ?? $request->user()->name;
        }

        $customsCheckpoint->update($data);

        if (
            isset($data['status']) &&
            $data['status'] === 'arrived' &&
            $previousStatus !== 'arrived'
        ) {
            $this->recordArrivalEvent($customsCheckpoint, $request->user());
        }

        return new CustomsCheckpointResource($customsCheckpoint->load('operation'));
    }

    public function destroy(CustomsCheckpoint $customsCheckpoint)
    {
        $customsCheckpoint->delete();

        return response()->json(['message' => 'Point de passage supprime.']);
    }

    private function recordArrivalEvent(CustomsCheckpoint $checkpoint, $user): void
    {
        $kindLabel = $checkpoint->checkpoint_kind === 'customs_office'
            ? 'Bureau de douane'
            : 'Position GPS / point exact';

        OperationEvent::create([
            'operation_id' => $checkpoint->operation_id,
            'type' => 'customs_passage',
            'title' => 'Arrivee confirmee — ' . $checkpoint->label,
            'description' => implode(' · ', array_filter([
                $kindLabel . ' : ' . $checkpoint->label,
                $checkpoint->address ? 'Lieu : ' . $checkpoint->address : null,
                $checkpoint->country_code ? 'Pays (ISO) : ' . $checkpoint->country_code : null,
                $checkpoint->customs_reference ? 'Ref. douaniere : ' . $checkpoint->customs_reference : null,
            ])),
            'actor' => $user->id,
            'metadata' => [
                'checkpoint_id' => $checkpoint->id,
                'checkpoint_kind' => $checkpoint->checkpoint_kind,
            ],
        ]);
    }
}
