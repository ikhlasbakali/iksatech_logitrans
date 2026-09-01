<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OperationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'client_id' => $this->client_id,
            'type' => $this->type,
            'status' => $this->status,
            'previous_status' => $this->previous_status,
            'priority' => $this->priority,
            'incoterm' => $this->incoterm,
            'pickup_address' => $this->pickup_address,
            'pickup_city' => $this->pickup_city,
            'pickup_country' => $this->pickup_country,
            'delivery_address' => $this->delivery_address,
            'delivery_city' => $this->delivery_city,
            'delivery_country' => $this->delivery_country,
            'scheduled_pickup' => $this->scheduled_pickup,
            'scheduled_delivery' => $this->scheduled_delivery,
            'actual_pickup' => $this->actual_pickup,
            'actual_delivery' => $this->actual_delivery,
            'eta' => $this->eta,
            'driver_1_id' => $this->driver_1_id,
            'driver_2_id' => $this->driver_2_id,
            'vehicle_id' => $this->vehicle_id,
            'cargo_description' => $this->cargo_description,
            'cargo_weight' => $this->cargo_weight,
            'cargo_volume' => $this->cargo_volume,
            'cargo_pallets' => $this->cargo_pallets,
            'temperature_controlled' => $this->temperature_controlled,
            'is_adr' => $this->is_adr,
            'special_instructions' => $this->special_instructions,
            'delay_minutes' => $this->delay_minutes,
            'assigned_agent' => $this->assigned_agent,
            'client' => $this->whenLoaded('client'),
            'driver1' => $this->whenLoaded('driver1'),
            'driver2' => $this->whenLoaded('driver2'),
            'vehicle' => $this->whenLoaded('vehicle'),
            'assignedAgent' => $this->whenLoaded('assignedAgent'),
            'events' => $this->whenLoaded('events'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}