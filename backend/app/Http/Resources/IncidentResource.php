<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncidentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'operation_id' => $this->operation_id,
            'dossier_reference' => $this->whenLoaded('operation', fn () => $this->operation?->reference),
            'type' => $this->type,
            'severity' => $this->severity,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'assigned_to' => $this->assigned_to,
            'resolution' => $this->resolution,
            'resolved_at' => $this->resolved_at,
            'reported_by' => $this->reported_by,
            'operation' => $this->whenLoaded('operation'),
            'reportedBy' => $this->whenLoaded('reportedBy'),
            'assignedTo' => $this->whenLoaded('assignedTo'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
