<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePlatformNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'target_role' => ['sometimes', 'string', 'max:255', Rule::in([
                'admin', 'manager', 'exploitation_manager', 'agent', 'support', 'client', 'driver',
            ])],
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'related_operation_id' => 'nullable|integer|exists:operations,id',
            'is_read' => 'sometimes|boolean',
        ];
    }
}
