<?php

namespace App\Http\Requests;

use App\Models\WorkflowRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreWorkflowRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'enabled' => 'nullable|boolean',
            'trigger' => 'required|in:' . implode(',', WorkflowRule::TRIGGERS),
            'name' => 'required|string|max:255',
            'actions' => 'required|array',
        ];
    }
}
