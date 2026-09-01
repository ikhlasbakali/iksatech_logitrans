<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id', 'type', 'description', 'maintenance_date',
        'mileage_at_service', 'cost', 'service_provider',
        'next_service_km', 'status', 'notes',
    ];

    protected $casts = [
        'maintenance_date' => 'date',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}