<?php

namespace App\Http\Requests;

use App\Models\DocumentAuditLog;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentAuditLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document_id' => 'sometimes|integer|exists:documents,id',
            'action' => 'sometimes|in:' . implode(',', DocumentAuditLog::ACTIONS),
        ];
    }
}
