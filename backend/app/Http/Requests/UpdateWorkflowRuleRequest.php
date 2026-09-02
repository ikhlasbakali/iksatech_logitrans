<?php

namespace App\Http\Requests;

use App\Models\WorkflowRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkflowRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'enabled' => 'sometimes|boolean',
            'trigger' => 'sometimes|in:' . implode(',', WorkflowRule::TRIGGERS),
            'name' => 'sometimes|string|max:255',
            'actions' => 'sometimes|array',
        ];
    }
}
