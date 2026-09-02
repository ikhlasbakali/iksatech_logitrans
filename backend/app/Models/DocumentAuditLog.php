<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentAuditLog extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    public const ACTIONS = ['uploaded', 'validated', 'rejected', 'downloaded'];

    protected $fillable = [
        'document_id',
        'action',
        'actor_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
