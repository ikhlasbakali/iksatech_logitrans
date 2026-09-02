<?php

namespace App\Http\Controllers;

use App\Models\SalesQuote;
use App\Http\Requests\StoreSalesQuoteRequest;
use App\Http\Resources\SalesQuoteResource;
use Illuminate\Http\Request;

class SalesQuoteController extends Controller
{
    public function index()
    {
        return SalesQuoteResource::collection(SalesQuote::with('client', 'commercialOwner')->get());
    }

    public function store(StoreSalesQuoteRequest $request)
    {
        $quote = SalesQuote::create([
            ...$request->validated(),
            'commercial_owner' => $request->user()->id,
        ]);
        return new SalesQuoteResource($quote);
    }

    public function show(SalesQuote $salesQuote)
    {
        return new SalesQuoteResource($salesQuote->load('client', 'commercialOwner'));
    }

    public function update(Request $request, SalesQuote $salesQuote)
    {
        $salesQuote->update($request->all());
        return new SalesQuoteResource($salesQuote);
    }

    public function destroy(SalesQuote $salesQuote)
    {
        $salesQuote->delete();
        return response()->json(['message' => 'Devis supprimé.']);
    }
}