<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    public const TYPES = [
        'delay',
        'damage',
        'accident',
        'breakdown',
        'missing_docs',
        'customer_complaint',
        'other',
    ];

    public const SEVERITIES = ['low', 'medium', 'high', 'critical'];

    public const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

    protected $fillable = [
        'operation_id',
        'type',
        'severity',
        'title',
        'description',
        'status',
        'assigned_to',
        'resolution',
        'resolved_at',
        'reported_by',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function operation()
    {
        return $this->belongsTo(Operation::class);
    }

    public function reportedBy()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
