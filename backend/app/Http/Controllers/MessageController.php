<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        return MessageResource::collection(Message::with('sender', 'receiver')->get());
    }

    public function store(StoreMessageRequest $request)
    {
        $message = Message::create([
            ...$request->validated(),
            'sender_id' => $request->user()->id,
            'sent_at' => now(),
        ]);
        return new MessageResource($message);
    }

    public function show(Message $message)
    {
        return new MessageResource($message->load('sender', 'receiver'));
    }

    public function update(Request $request, Message $message)
    {
        $message->update($request->all());
        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        $message->delete();
        return response()->json(['message' => 'Message supprimé.']);
    }
}