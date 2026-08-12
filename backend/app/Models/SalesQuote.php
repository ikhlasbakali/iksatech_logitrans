<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesQuote extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'client_id', 'commercial_owner', 'contact_name',
        'contact_email', 'title', 'subtotal', 'vat_rate',
        'discount_amount', 'total', 'currency', 'quote_lines',
        'valid_until', 'status', 'notes',
    ];

    protected $casts = [
        'quote_lines' => 'array',
        'valid_until' => 'datetime',
        'subtotal' => 'decimal:2',
        'vat_rate' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function commercialOwner()
    {
        return $this->belongsTo(User::class, 'commercial_owner');
    }
}