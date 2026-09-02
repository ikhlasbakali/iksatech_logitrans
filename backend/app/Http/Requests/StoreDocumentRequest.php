<?php

namespace App\Http\Requests;

use App\Models\Document;
use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'operation_id' => 'required|integer|exists:operations,id',
            'type' => 'required|in:' . implode(',', Document::TYPES),
            'name' => 'nullable|string|max:255',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png,webp|max:10240',
            'notes' => 'nullable|string',
            'metadata' => 'nullable|array',
        ];
    }
}
