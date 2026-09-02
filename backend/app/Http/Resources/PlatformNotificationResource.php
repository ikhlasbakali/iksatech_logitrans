<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlatformNotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'target_role' => $this->target_role,
            'target_roles' => [$this->target_role],
            'title' => $this->title,
            'body' => $this->body,
            'message' => $this->body,
            'related_operation_id' => $this->related_operation_id,
            'is_read' => $this->is_read,
            'read' => $this->is_read,
            'read_at' => $this->is_read ? $this->updated_at : null,
            'relatedOperation' => $this->whenLoaded('relatedOperation'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
