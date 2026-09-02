<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSecurityAuditLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => 'required|string|max:255',
            'target_type' => 'nullable|string|max:255',
            'target_id' => 'nullable|integer|min:1',
            'metadata' => 'nullable|array',
        ];
    }
}
