<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentAuditLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'document_id' => $this->document_id,
            'dossier_reference' => $this->whenLoaded('document', fn () => $this->document?->operation?->reference),
            'action' => $this->action,
            'actor_id' => $this->actor_id,
            'actor' => $this->whenLoaded('actor', fn () => $this->actor?->name),
            'document' => $this->whenLoaded('document'),
            'created_at' => $this->created_at,
        ];
    }
}
