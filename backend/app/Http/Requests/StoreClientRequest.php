<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => 'required|string|max:255|unique:clients,company_name',
            'external_code' => 'nullable|string|max:255',
            'legal_id' => 'nullable|string|max:255',
            'sector' => 'nullable|string|max:255',
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'phone_number' => 'nullable|string|max:255',
            'address_line1' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'payment_terms' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ];
    }
}