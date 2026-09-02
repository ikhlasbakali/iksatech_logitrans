<?php

namespace App\Http\Requests;

use App\Models\CustomsCheckpoint;
use Illuminate\Foundation\Http\FormRequest;

class StoreCustomsCheckpointRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'operation_id' => 'required|integer|exists:operations,id',
            'checkpoint_kind' => 'required|in:' . implode(',', CustomsCheckpoint::CHECKPOINT_KINDS),
            'label' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'country_code' => 'required|string|size:2',
            'customs_reference' => 'nullable|string|max:255',
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
            'sequence_order' => 'required|integer|min:0',
            'scheduled_window_start' => 'nullable|date',
            'scheduled_window_end' => 'nullable|date|after_or_equal:scheduled_window_start',
            'status' => 'nullable|in:' . implode(',', CustomsCheckpoint::STATUSES),
            'radius_meters' => 'nullable|integer|min:0',
        ];
    }
}
