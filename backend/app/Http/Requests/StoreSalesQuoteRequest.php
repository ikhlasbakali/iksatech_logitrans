<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSalesQuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reference' => 'required|string|max:255|unique:sales_quotes,reference',
            'client_id' => 'required|exists:clients,id',
            'contact_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'title' => 'required|string|max:255',
            'subtotal' => 'required|numeric|min:0',
            'vat_rate' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'quote_lines' => 'nullable|array',
            'valid_until' => 'required|date',
            'status' => 'nullable|in:draft,sent,accepted,rejected,expired,invoiced',
            'notes' => 'nullable|string',
        ];
    }
}