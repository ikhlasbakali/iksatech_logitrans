<?php

namespace App\Http\Requests;

use App\Models\Incident;
use Illuminate\Foundation\Http\FormRequest;

class UpdateIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'operation_id' => 'nullable|integer|exists:operations,id',
            'type' => 'sometimes|in:' . implode(',', Incident::TYPES),
            'severity' => 'sometimes|in:' . implode(',', Incident::SEVERITIES),
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:' . implode(',', Incident::STATUSES),
            'assigned_to' => 'nullable|integer|exists:users,id',
            'resolution' => 'nullable|string',
        ];
    }
}
