<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomsCheckpoint extends Model
{
    use HasFactory;

    public const CHECKPOINT_KINDS = ['customs_office', 'gps_waypoint'];

    public const STATUSES = ['pending', 'arrived', 'completed', 'skipped', 'cancelled'];

    protected $fillable = [
        'operation_id',
        'checkpoint_kind',
        'label',
        'address',
        'country_code',
        'customs_reference',
        'lat',
        'lng',
        'sequence_order',
        'scheduled_window_start',
        'scheduled_window_end',
        'status',
        'radius_meters',
        'arrived_at',
        'arrived_by_name',
        'arrived_lat',
        'arrived_lng',
    ];

    protected $casts = [
        'lat' => 'decimal:7',
        'lng' => 'decimal:7',
        'arrived_lat' => 'decimal:7',
        'arrived_lng' => 'decimal:7',
        'scheduled_window_start' => 'datetime',
        'scheduled_window_end' => 'datetime',
        'arrived_at' => 'datetime',
    ];

    public function operation()
    {
        return $this->belongsTo(Operation::class);
    }
}
