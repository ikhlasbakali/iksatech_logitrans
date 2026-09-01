<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OperationEventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'operation_id' => $this->operation_id,
            'type' => $this->type,
            'title' => $this->title,
            'description' => $this->description,
            'actor' => $this->actor,
            'metadata' => $this->metadata,
            'operation' => $this->whenLoaded('operation'),
            'actor_user' => $this->whenLoaded('actorUser'),
            'created_at' => $this->created_at,
        ];
    }
}