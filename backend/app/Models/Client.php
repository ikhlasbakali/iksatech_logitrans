<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name', 'external_code', 'legal_id', 'sector',
        'contact_name', 'contact_email', 'phone_number',
        'address_line1', 'city', 'postal_code', 'country',
        'payment_terms', 'type', 'user_id', 'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function salesQuotes()
    {
        return $this->hasMany(SalesQuote::class);
    }
}