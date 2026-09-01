<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'first_name', 'last_name', 'phone', 'email',
        'license_number', 'license_type', 'status', 'current_position',
        'current_lat', 'current_lng', 'current_vehicle_id',
        'visa_expiry_date', 'rating', 'total_deliveries', 'on_time_rate',
        'certifications', 'photo_url', 'is_active',
    ];

    protected $casts = [
        'certifications' => 'array',
        'is_active' => 'boolean',
        'visa_expiry_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function currentVehicle()
    {
        return $this->belongsTo(Vehicle::class, 'current_vehicle_id');
    }

    public function assignedVehicles()
    {
        return $this->hasMany(Vehicle::class, 'current_driver_id');
    }
}