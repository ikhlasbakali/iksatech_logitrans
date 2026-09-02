<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    public const TYPES = [
        'nota',
        'commercial_invoice',
        'cmr',
        'loading_sheet',
        'mrn',
        't1',
        'salida',
        'eur1',
        'mlv',
        'bl',
        'invoice',
        'pod',
        'packing_list',
        'customs',
        'photo',
        'other',
    ];

    public const STATUSES = ['pending', 'validated', 'rejected'];

    public const CUSTOMS_CHAIN = [
        'nota',
        'commercial_invoice',
        'cmr',
        'loading_sheet',
        'mrn',
        't1',
        'salida',
        'eur1',
        'mlv',
    ];

    protected $fillable = [
        'operation_id',
        'type',
        'name',
        'file_url',
        'file_path',
        'uploaded_by',
        'status',
        'validated_by',
        'validated_at',
        'rejected_by',
        'rejected_at',
        'metadata',
        'notes',
    ];

    protected $casts = [
        'metadata' => 'array',
        'validated_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    public function operation()
    {
        return $this->belongsTo(Operation::class);
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function validatedBy()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    public function rejectedBy()
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function auditLogs()
    {
        return $this->hasMany(DocumentAuditLog::class);
    }
}
