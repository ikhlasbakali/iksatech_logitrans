<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id|unique:drivers,user_id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'license_number' => 'required|string|max:255|unique:drivers,license_number',
            'license_type' => 'required|string|max:255',
            'status' => 'nullable|in:available,on_mission,off_duty,on_break,inactive',
            'current_vehicle_id' => 'nullable|integer|exists:vehicles,id',
            'visa_expiry_date' => 'nullable|date',
            'rating' => 'nullable|numeric|min:0|max:5',
            'certifications' => 'nullable|array',
            'photo_url' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ];
    }
}