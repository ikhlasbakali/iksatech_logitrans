<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'operation_id' => $this->operation_id,
            'dossier_reference' => $this->whenLoaded('operation', fn () => $this->operation?->reference),
            'type' => $this->type,
            'name' => $this->name,
            'file_url' => $this->file_url,
            'status' => $this->status,
            'uploaded_by' => $this->uploaded_by,
            'validated_by' => $this->validated_by,
            'validated_at' => $this->validated_at,
            'rejected_by' => $this->rejected_by,
            'rejected_at' => $this->rejected_at,
            'metadata' => $this->metadata,
            'notes' => $this->notes,
            'operation' => $this->whenLoaded('operation'),
            'uploadedBy' => $this->whenLoaded('uploadedBy'),
            'validatedBy' => $this->whenLoaded('validatedBy'),
            'rejectedBy' => $this->whenLoaded('rejectedBy'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
