<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'target_role',
        'title',
        'body',
        'related_operation_id',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    public function relatedOperation()
    {
        return $this->belongsTo(Operation::class, 'related_operation_id');
    }

    public function markAsRead(): void
    {
        $this->update(['is_read' => true]);
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeForRole($query, string $role)
    {
        return $query->where('target_role', $role);
    }
}
