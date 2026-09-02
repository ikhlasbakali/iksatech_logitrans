<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOperationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reference' => 'required|string|max:255|unique:operations,reference',
            'client_id' => 'required|integer|exists:clients,id',
            'type' => 'required|in:import,export,national,international,groupage,lot_complet',
            'status' => 'nullable|in:draft,confirmed,assigned,loading,in_transit,unloading,delivered,completed,cancelled,incident',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'incoterm' => 'nullable|string|max:255',
            'pickup_address' => 'nullable|string|max:255',
            'pickup_city' => 'nullable|string|max:255',
            'pickup_country' => 'nullable|string|max:255',
            'delivery_address' => 'nullable|string|max:255',
            'delivery_city' => 'nullable|string|max:255',
            'delivery_country' => 'nullable|string|max:255',
            'scheduled_pickup' => 'nullable|date',
            'scheduled_delivery' => 'nullable|date',
            'driver_1_id' => 'nullable|integer|exists:drivers,id',
            'driver_2_id' => 'nullable|integer|exists:drivers,id',
            'vehicle_id' => 'nullable|integer|exists:vehicles,id',
            'cargo_description' => 'nullable|string',
            'cargo_weight' => 'nullable|numeric|min:0',
            'cargo_volume' => 'nullable|numeric|min:0',
            'cargo_pallets' => 'nullable|integer|min:0',
            'temperature_controlled' => 'nullable|boolean',
            'is_adr' => 'nullable|boolean',
            'special_instructions' => 'nullable|string',
            'assigned_agent' => 'nullable|integer|exists:users,id',
        ];
    }
}