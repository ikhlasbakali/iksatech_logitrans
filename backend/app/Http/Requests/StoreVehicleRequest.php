<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plate_number' => 'required|string|max:255|unique:vehicles,plate_number',
            'brand' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1950|max:' . (date('Y') + 1),
            'vehicle_type' => 'required|in:van,truck_12t,truck_19t,truck_44t,semi_trailer,refrigerated,tanker',
            'flux_category' => 'nullable|in:national,international,mixte',
            'status' => 'nullable|in:available,in_use,maintenance,out_of_service',
            'max_weight' => 'nullable|numeric|min:0',
            'max_volume' => 'nullable|numeric|min:0',
            'temperature_controlled' => 'nullable|boolean',
            'adr_certified' => 'nullable|boolean',
            'current_driver_id' => 'nullable|integer|exists:drivers,id|unique:vehicles,current_driver_id',
            'mileage' => 'nullable|integer|min:0',
            'maintenance_interval_km' => 'nullable|integer|min:0',
            'last_maintenance_date' => 'nullable|date',
            'next_maintenance_date' => 'nullable|date',
            'technical_inspection_date' => 'nullable|date',
            'insurance_expiry' => 'nullable|date',
            'registration_expiry' => 'nullable|date',
            'fuel_consumption_avg' => 'nullable|numeric|min:0',
        ];
    }
}