<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'plate_number', 'brand', 'model', 'year', 'vehicle_type',
        'flux_category', 'status', 'max_weight', 'max_volume',
        'temperature_controlled', 'adr_certified', 'current_driver_id',
        'current_lat', 'current_lng', 'mileage', 'maintenance_interval_km',
        'last_maintenance_km', 'last_maintenance_date', 'next_maintenance_date',
        'technical_inspection_date', 'insurance_expiry', 'registration_expiry',
        'fuel_consumption_avg', 'total_fuel_cost', 'total_maintenance_cost',
    ];

    protected $casts = [
        'temperature_controlled' => 'boolean',
        'adr_certified' => 'boolean',
        'last_maintenance_date' => 'date',
        'next_maintenance_date' => 'date',
        'technical_inspection_date' => 'date',
        'insurance_expiry' => 'date',
        'registration_expiry' => 'date',
    ];

    public function currentDriver()
    {
        return $this->belongsTo(Driver::class, 'current_driver_id');
    }

    public function costs()
    {
        return $this->hasMany(VehicleCost::class);
    }

    public function maintenanceHistories()
    {
        return $this->hasMany(MaintenanceHistory::class);
    }
}