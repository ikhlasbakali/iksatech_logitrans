<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'operation_id' => 'nullable|exists:operations,id',
            'sender_role_label' => 'nullable|string|max:255',
            'receiver_id' => 'nullable|exists:users,id',
            'content' => 'required|string',
            'type' => 'nullable|in:message,status_update,alert,system',
            'attachments' => 'nullable|array',
        ];
    }
}