<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkflowRuleRequest;
use App\Http\Requests\UpdateWorkflowRuleRequest;
use App\Http\Resources\WorkflowRuleResource;
use App\Models\WorkflowRule;
use Illuminate\Http\Request;

class WorkflowRuleController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkflowRule::query()->latest('created_at');

        if ($request->filled('trigger')) {
            $query->where('trigger', $request->string('trigger'));
        }

        if ($request->has('enabled')) {
            $query->where('enabled', $request->boolean('enabled'));
        }

        return WorkflowRuleResource::collection($query->get());
    }

    public function store(StoreWorkflowRuleRequest $request)
    {
        $data = $request->validated();
        $data['enabled'] = $data['enabled'] ?? true;

        $rule = WorkflowRule::create($data);

        return (new WorkflowRuleResource($rule))
            ->response()
            ->setStatusCode(201);
    }

    public function show(WorkflowRule $workflowRule)
    {
        return new WorkflowRuleResource($workflowRule);
    }

    public function update(UpdateWorkflowRuleRequest $request, WorkflowRule $workflowRule)
    {
        $workflowRule->update($request->validated());

        return new WorkflowRuleResource($workflowRule);
    }

    public function destroy(WorkflowRule $workflowRule)
    {
        $workflowRule->delete();

        return response()->json(['message' => 'Regle de workflow supprimee.']);
    }
}
