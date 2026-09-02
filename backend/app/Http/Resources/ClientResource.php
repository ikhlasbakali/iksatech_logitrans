<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'external_code' => $this->external_code,
            'legal_id' => $this->legal_id,
            'sector' => $this->sector,
            'contact_name' => $this->contact_name,
            'contact_email' => $this->contact_email,
            'phone_number' => $this->phone_number,
            'address_line1' => $this->address_line1,
            'city' => $this->city,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'payment_terms' => $this->payment_terms,
            'type' => $this->type,
            'notes' => $this->notes,
            'sales_quotes_count' => $this->whenCounted('salesQuotes'),
            'sales_quotes' => SalesQuoteResource::collection($this->whenLoaded('salesQuotes')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}