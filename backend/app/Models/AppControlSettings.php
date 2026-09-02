<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppControlSettings extends Model
{
    use HasFactory;

    public const CREATED_AT = null;

    protected $table = 'app_control_settings';

    protected $fillable = [
        'role_module_grants',
    ];

    protected $casts = [
        'role_module_grants' => 'array',
        'updated_at' => 'datetime',
    ];
}
