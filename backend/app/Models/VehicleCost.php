<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleCost extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id', 'type', 'amount', 'quantity', 'unit_price',
        'mileage_at_transaction', 'supplier', 'invoice_number',
        'cost_date', 'notes',
    ];

    protected $casts = [
        'cost_date' => 'date',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}