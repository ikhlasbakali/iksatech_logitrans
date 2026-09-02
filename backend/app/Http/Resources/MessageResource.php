<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'operation_id' => $this->operation_id,
            'sender_id' => $this->sender_id,
            'sender' => new UserResource($this->whenLoaded('sender')),
            'sender_role_label' => $this->sender_role_label,
            'receiver_id' => $this->receiver_id,
            'receiver' => new UserResource($this->whenLoaded('receiver')),
            'content' => $this->content,
            'type' => $this->type,
            'attachments' => $this->attachments,
            'is_read' => $this->is_read,
            'sent_at' => $this->sent_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}