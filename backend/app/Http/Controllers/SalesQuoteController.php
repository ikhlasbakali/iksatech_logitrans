<?php

namespace App\Http\Controllers;

use App\Models\SalesQuote;
use App\Http\Requests\StoreSalesQuoteRequest;
use App\Http\Resources\SalesQuoteResource;
use App\Support\AccessScope;
use Illuminate\Http\Request;

class SalesQuoteController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', SalesQuote::class);

        $query = SalesQuote::with('client', 'commercialOwner');
        AccessScope::scopeSalesQuotes($query, $request->user());

        return SalesQuoteResource::collection($query->get());
    }

    public function store(StoreSalesQuoteRequest $request)
    {
        $this->authorize('create', SalesQuote::class);

        $quote = SalesQuote::create([
            ...$request->validated(),
            'commercial_owner' => $request->user()->id,
        ]);

        return new SalesQuoteResource($quote);
    }

    public function show(SalesQuote $salesQuote)
    {
        $this->authorize('view', $salesQuote);

        return new SalesQuoteResource($salesQuote->load('client', 'commercialOwner'));
    }

    public function update(Request $request, SalesQuote $salesQuote)
    {
        $this->authorize('update', $salesQuote);

        $salesQuote->update($request->all());

        return new SalesQuoteResource($salesQuote);
    }

    public function destroy(SalesQuote $salesQuote)
    {
        $this->authorize('delete', $salesQuote);

        $salesQuote->delete();

        return response()->json(['message' => 'Devis supprime.']);
    }
}
