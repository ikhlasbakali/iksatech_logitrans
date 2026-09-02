<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Operation;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Support\AccessScope;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Message::class);

        $query = Message::with('sender', 'receiver', 'operation');
        AccessScope::scopeMessages($query, $request->user());

        return MessageResource::collection($query->get());
    }

    public function store(StoreMessageRequest $request)
    {
        $this->authorize('create', Message::class);

        if ($request->filled('operation_id')) {
            $operation = Operation::findOrFail($request->integer('operation_id'));
            $this->authorize('view', $operation);
        }

        $message = Message::create([
            ...$request->validated(),
            'sender_id' => $request->user()->id,
            'sent_at' => now(),
        ]);

        return new MessageResource($message->load('operation'));
    }

    public function show(Message $message)
    {
        $this->authorize('view', $message);

        return new MessageResource($message->load('sender', 'receiver', 'operation'));
    }

    public function update(Request $request, Message $message)
    {
        $this->authorize('update', $message);

        $message->update($request->all());

        return new MessageResource($message->load('operation'));
    }

    public function destroy(Message $message)
    {
        $this->authorize('delete', $message);

        $message->delete();

        return response()->json(['message' => 'Message supprime.']);
    }
}
