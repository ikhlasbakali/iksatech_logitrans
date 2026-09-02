<?php

namespace App\Http\Requests;

use App\Models\DocumentAuditLog;
use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentAuditLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document_id' => 'required|integer|exists:documents,id',
            'action' => 'required|in:' . implode(',', DocumentAuditLog::ACTIONS),
        ];
    }
}
