<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesQuoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'client_id' => $this->client_id,
            'client' => new ClientResource($this->whenLoaded('client')),
            'commercial_owner' => $this->commercial_owner,
            'contact_name' => $this->contact_name,
            'contact_email' => $this->contact_email,
            'title' => $this->title,
            'subtotal' => $this->subtotal,
            'vat_rate' => $this->vat_rate,
            'discount_amount' => $this->discount_amount,
            'total' => $this->total,
            'currency' => $this->currency,
            'quote_lines' => $this->quote_lines,
            'valid_until' => $this->valid_until,
            'status' => $this->status,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}