<?php

namespace App\Http\Requests;

use App\Models\Incident;
use Illuminate\Foundation\Http\FormRequest;

class StoreIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'operation_id' => 'nullable|integer|exists:operations,id',
            'type' => 'nullable|in:' . implode(',', Incident::TYPES),
            'severity' => 'nullable|in:' . implode(',', Incident::SEVERITIES),
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:' . implode(',', Incident::STATUSES),
            'assigned_to' => 'nullable|integer|exists:users,id',
            'resolution' => 'nullable|string',
        ];
    }
}
