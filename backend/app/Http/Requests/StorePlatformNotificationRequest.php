<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePlatformNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'target_role' => ['required', 'string', 'max:255', Rule::in([
                'admin', 'manager', 'exploitation_manager', 'agent', 'support', 'client', 'driver',
            ])],
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'related_operation_id' => 'nullable|integer|exists:operations,id',
            'is_read' => 'nullable|boolean',
        ];
    }
}
