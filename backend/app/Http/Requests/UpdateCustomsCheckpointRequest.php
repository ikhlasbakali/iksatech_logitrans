<?php

namespace App\Http\Requests;

use App\Models\CustomsCheckpoint;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomsCheckpointRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'checkpoint_kind' => 'sometimes|in:' . implode(',', CustomsCheckpoint::CHECKPOINT_KINDS),
            'label' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'country_code' => 'sometimes|string|size:2',
            'customs_reference' => 'nullable|string|max:255',
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
            'sequence_order' => 'sometimes|integer|min:0',
            'scheduled_window_start' => 'nullable|date',
            'scheduled_window_end' => 'nullable|date',
            'status' => 'sometimes|in:' . implode(',', CustomsCheckpoint::STATUSES),
            'radius_meters' => 'nullable|integer|min:0',
            'arrived_at' => 'nullable|date',
            'arrived_by_name' => 'nullable|string|max:255',
            'arrived_lat' => 'nullable|numeric|between:-90,90',
            'arrived_lng' => 'nullable|numeric|between:-180,180',
        ];
    }
}
