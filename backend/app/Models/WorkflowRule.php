<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkflowRule extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    public const TRIGGERS = [
        'operation.created',
        'document.validated',
        'delay.detected',
        'vehicle.inactive',
    ];

    protected $fillable = [
        'enabled',
        'trigger',
        'name',
        'actions',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'actions' => 'array',
        'created_at' => 'datetime',
    ];
}
