<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DriverResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'license_number' => $this->license_number,
            'license_type' => $this->license_type,
            'status' => $this->status,
            'current_position' => $this->current_position,
            'current_vehicle_id' => $this->current_vehicle_id,
            'visa_expiry_date' => $this->visa_expiry_date,
            'rating' => $this->rating,
            'total_deliveries' => $this->total_deliveries,
            'on_time_rate' => $this->on_time_rate,
            'certifications' => $this->certifications,
            'photo_url' => $this->photo_url,
            'is_active' => $this->is_active,
            'user' => $this->whenLoaded('user'),
            'current_vehicle' => $this->whenLoaded('currentVehicle'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}