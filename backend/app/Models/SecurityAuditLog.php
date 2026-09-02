<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityAuditLog extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    public const MAX_ENTRIES = 200;

    protected $fillable = [
        'actor_id',
        'action',
        'target_type',
        'target_id',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public static function pruneExcess(): void
    {
        $excessIds = static::query()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->skip(static::MAX_ENTRIES)
            ->pluck('id');

        if ($excessIds->isNotEmpty()) {
            static::whereIn('id', $excessIds)->delete();
        }
    }
}
