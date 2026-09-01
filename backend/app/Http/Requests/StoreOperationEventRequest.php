<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOperationEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'operation_id' => 'required|integer|exists:operations,id',
            'type' => 'required|in:created,assigned,status_change,location_update,document_added,message,incident,completed,customs_passage',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'actor' => 'nullable|integer|exists:users,id',
            'metadata' => 'nullable|array',
        ];
    }
}