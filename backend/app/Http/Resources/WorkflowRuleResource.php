<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkflowRuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'enabled' => $this->enabled,
            'is_active' => $this->enabled,
            'trigger' => $this->trigger,
            'event_trigger' => $this->trigger,
            'name' => $this->name,
            'actions' => $this->actions,
            'conditions' => null,
            'created_at' => $this->created_at,
        ];
    }
}
