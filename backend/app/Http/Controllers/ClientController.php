<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Http\Requests\StoreClientRequest;
use App\Http\Resources\ClientResource;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Client::class);

        return ClientResource::collection(Client::with('salesQuotes')->get());
    }

    public function store(StoreClientRequest $request)
    {
        $this->authorize('create', Client::class);

        $client = Client::create($request->validated());

        return new ClientResource($client);
    }

    public function show(Client $client)
    {
        $this->authorize('view', $client);

        return new ClientResource($client->load('salesQuotes'));
    }

    public function update(Request $request, Client $client)
    {
        $this->authorize('update', $client);

        $client->update($request->all());

        return new ClientResource($client);
    }

    public function destroy(Client $client)
    {
        $this->authorize('delete', $client);

        $client->delete();

        return response()->json(['message' => 'Client supprime.']);
    }
}
