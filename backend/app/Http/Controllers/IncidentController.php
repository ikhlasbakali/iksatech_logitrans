<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIncidentRequest;
use App\Http\Requests\UpdateIncidentRequest;
use App\Http\Resources\IncidentResource;
use App\Models\Incident;
use App\Models\OperationEvent;
use Illuminate\Http\Request;

class IncidentController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Incident::class);

        $query = Incident::with(['operation', 'reportedBy', 'assignedTo']);

        if ($request->filled('operation_id')) {
            $query->where('operation_id', $request->integer('operation_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('severity')) {
            $query->where('severity', $request->string('severity'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        return IncidentResource::collection($query->latest()->get());
    }

    public function store(StoreIncidentRequest $request)
    {
        $this->authorize('create', Incident::class);

        $data = $request->validated();
        $data['reported_by'] = $request->user()->id;
        $data['type'] = $data['type'] ?? 'other';
        $data['severity'] = $data['severity'] ?? 'medium';
        $data['status'] = $data['status'] ?? 'open';

        $incident = Incident::create($data);

        if ($incident->operation_id) {
            OperationEvent::create([
                'operation_id' => $incident->operation_id,
                'type' => 'incident',
                'title' => 'Incident declare — ' . $incident->title,
                'description' => $incident->description,
                'actor' => $request->user()->id,
                'metadata' => [
                    'incident_id' => $incident->id,
                    'severity' => $incident->severity,
                    'type' => $incident->type,
                ],
            ]);
        }

        return (new IncidentResource($incident->load(['operation', 'reportedBy', 'assignedTo'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Incident $incident)
    {
        $this->authorize('view', $incident);

        return new IncidentResource(
            $incident->load(['operation', 'reportedBy', 'assignedTo'])
        );
    }

    public function update(UpdateIncidentRequest $request, Incident $incident)
    {
        $this->authorize('update', $incident);

        $data = $request->validated();
        $previousStatus = $incident->status;

        if (isset($data['status']) && in_array($data['status'], ['resolved', 'closed'])) {
            $data['resolved_at'] = $data['resolved_at'] ?? now();
        } elseif (isset($data['status']) && in_array($data['status'], ['open', 'in_progress'])) {
            $data['resolved_at'] = null;
        }

        $incident->update($data);

        if (isset($data['status']) && $data['status'] !== $previousStatus && $incident->operation_id) {
            $title = match ($incident->status) {
                'resolved' => 'Incident resolu',
                'closed' => 'Incident cloture',
                'in_progress' => 'Incident en cours de traitement',
                default => 'Incident mis a jour',
            };

            OperationEvent::create([
                'operation_id' => $incident->operation_id,
                'type' => 'incident',
                'title' => $title . ' — ' . $incident->title,
                'description' => $incident->resolution ?? $incident->description,
                'actor' => $request->user()->id,
                'metadata' => [
                    'incident_id' => $incident->id,
                    'status' => $incident->status,
                ],
            ]);
        }

        return new IncidentResource(
            $incident->load(['operation', 'reportedBy', 'assignedTo'])
        );
    }

    public function destroy(Incident $incident)
    {
        $this->authorize('delete', $incident);

        $incident->delete();

        return response()->json(['message' => 'Incident supprime.']);
    }
}
