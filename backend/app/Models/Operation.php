<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operation extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'client_id', 'type', 'status', 'previous_status',
        'priority', 'incoterm', 'pickup_address', 'pickup_city', 'pickup_country',
        'pickup_lat', 'pickup_lng', 'delivery_address', 'delivery_city',
        'delivery_country', 'delivery_lat', 'delivery_lng', 'scheduled_pickup',
        'scheduled_delivery', 'actual_pickup', 'actual_delivery', 'eta',
        'driver_1_id', 'driver_2_id', 'vehicle_id', 'cargo_description',
        'cargo_weight', 'cargo_volume', 'cargo_pallets', 'temperature_controlled',
        'is_adr', 'special_instructions', 'current_lat', 'current_lng',
        'delay_minutes', 'ai_risk_score', 'ai_summary', 'assigned_agent',
    ];

    protected $casts = [
        'scheduled_pickup' => 'datetime',
        'scheduled_delivery' => 'datetime',
        'actual_pickup' => 'datetime',
        'actual_delivery' => 'datetime',
        'eta' => 'datetime',
        'temperature_controlled' => 'boolean',
        'is_adr' => 'boolean',
    ];

    public const STATUS_FLOW = [
        'draft' => ['confirmed', 'cancelled'],
        'confirmed' => ['assigned', 'cancelled'],
        'assigned' => ['loading', 'cancelled'],
        'loading' => ['in_transit', 'incident', 'cancelled'],
        'in_transit' => ['unloading', 'incident'],
        'unloading' => ['delivered', 'incident'],
        'delivered' => ['completed'],
        'completed' => [],
        'cancelled' => [],
        'incident' => ['in_transit', 'unloading', 'cancelled'],
    ];

    public function canTransitionTo(string $newStatus): bool
    {
        return in_array($newStatus, self::STATUS_FLOW[$this->status] ?? []);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function driver1()
    {
        return $this->belongsTo(Driver::class, 'driver_1_id');
    }

    public function driver2()
    {
        return $this->belongsTo(Driver::class, 'driver_2_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function assignedAgent()
    {
        return $this->belongsTo(User::class, 'assigned_agent');
    }

    public function events()
    {
        return $this->hasMany(OperationEvent::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }

    public function customsCheckpoints()
    {
        return $this->hasMany(CustomsCheckpoint::class);
    }
}