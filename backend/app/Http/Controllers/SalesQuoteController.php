<?php

namespace App\Http\Controllers;

use App\Models\SalesQuote;
use Illuminate\Http\Request;

class SalesQuoteController extends Controller
{
    public function index()
    {
        return SalesQuote::with('client', 'commercialOwner')->get();
    }

    public function store(Request $request)
    {
        $quote = SalesQuote::create([
            ...$request->all(),
            'commercial_owner' => $request->user()->id,
        ]);
        return response()->json($quote, 201);
    }

    public function show(SalesQuote $salesQuote)
    {
        return $salesQuote->load('client', 'commercialOwner');
    }

    public function update(Request $request, SalesQuote $salesQuote)
    {
        $salesQuote->update($request->all());
        return response()->json($salesQuote);
    }

    public function destroy(SalesQuote $salesQuote)
    {
        $salesQuote->delete();
        return response()->json(['message' => 'Devis supprimé.']);
    }
}