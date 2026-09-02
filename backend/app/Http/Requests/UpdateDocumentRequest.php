<?php

namespace App\Http\Requests;

use App\Models\Document;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'sometimes|in:' . implode(',', Document::TYPES),
            'name' => 'sometimes|string|max:255',
            'file' => 'sometimes|file|mimes:pdf,jpg,jpeg,png,webp|max:10240',
            'status' => 'sometimes|in:' . implode(',', Document::STATUSES),
            'notes' => 'nullable|string',
            'metadata' => 'nullable|array',
        ];
    }
}
