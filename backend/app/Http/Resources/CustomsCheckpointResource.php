<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomsCheckpointResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'operation_id' => $this->operation_id,
            'dossier_reference' => $this->whenLoaded('operation', fn () => $this->operation?->reference),
            'checkpoint_kind' => $this->checkpoint_kind,
            'label' => $this->label,
            'address' => $this->address,
            'country_code' => $this->country_code,
            'customs_reference' => $this->customs_reference,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'sequence_order' => $this->sequence_order,
            'scheduled_window_start' => $this->scheduled_window_start,
            'scheduled_window_end' => $this->scheduled_window_end,
            'status' => $this->status,
            'radius_meters' => $this->radius_meters,
            'arrived_at' => $this->arrived_at,
            'arrived_by_name' => $this->arrived_by_name,
            'arrived_lat' => $this->arrived_lat,
            'arrived_lng' => $this->arrived_lng,
            'operation' => $this->whenLoaded('operation'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
