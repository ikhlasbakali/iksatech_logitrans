<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'plate_number' => $this->plate_number,
            'brand' => $this->brand,
            'model' => $this->model,
            'year' => $this->year,
            'vehicle_type' => $this->vehicle_type,
            'flux_category' => $this->flux_category,
            'status' => $this->status,
            'max_weight' => $this->max_weight,
            'max_volume' => $this->max_volume,
            'temperature_controlled' => $this->temperature_controlled,
            'adr_certified' => $this->adr_certified,
            'current_driver_id' => $this->current_driver_id,
            'mileage' => $this->mileage,
            'maintenance_interval_km' => $this->maintenance_interval_km,
            'last_maintenance_km' => $this->last_maintenance_km,
            'last_maintenance_date' => $this->last_maintenance_date,
            'next_maintenance_date' => $this->next_maintenance_date,
            'technical_inspection_date' => $this->technical_inspection_date,
            'insurance_expiry' => $this->insurance_expiry,
            'registration_expiry' => $this->registration_expiry,
            'fuel_consumption_avg' => $this->fuel_consumption_avg,
            'total_fuel_cost' => $this->total_fuel_cost,
            'total_maintenance_cost' => $this->total_maintenance_cost,
            'current_driver' => $this->whenLoaded('currentDriver'),
            'costs' => $this->whenLoaded('costs'),
            'maintenance_histories' => $this->whenLoaded('maintenanceHistories'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}