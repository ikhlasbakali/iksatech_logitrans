<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SecurityAuditLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'actor_id' => $this->actor_id,
            'user_id' => $this->actor_id,
            'action' => $this->action,
            'event_type' => $this->action,
            'target_type' => $this->target_type,
            'target_id' => $this->target_id,
            'metadata' => $this->metadata,
            'details' => $this->metadata,
            'actor' => $this->whenLoaded('actor'),
            'actor_name' => $this->whenLoaded('actor', fn () => $this->actor?->name),
            'actor_email' => $this->whenLoaded('actor', fn () => $this->actor?->email),
            'created_at' => $this->created_at,
        ];
    }
}
