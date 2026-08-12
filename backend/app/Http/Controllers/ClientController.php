<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return Client::with('salesQuotes')->get();
    }

    public function store(Request $request)
    {
        $client = Client::create($request->all());
        return response()->json($client, 201);
    }

    public function show(Client $client)
    {
        return $client->load('salesQuotes');
    }

    public function update(Request $request, Client $client)
    {
        $client->update($request->all());
        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(['message' => 'Client supprimé.']);
    }
}