<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlatformNotificationRequest;
use App\Http\Requests\UpdatePlatformNotificationRequest;
use App\Http\Resources\PlatformNotificationResource;
use App\Models\PlatformNotification;
use Illuminate\Http\Request;

class PlatformNotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = PlatformNotification::with('relatedOperation')->latest();

        if ($request->boolean('unread_only')) {
            $query->unread();
        }

        if ($request->filled('target_role')) {
            $query->forRole($request->string('target_role'));
        } elseif ($request->boolean('for_current_user')) {
            $roles = $request->user()->getRoleNames()->toArray();
            $query->whereIn('target_role', $roles);
        }

        if ($request->filled('related_operation_id')) {
            $query->where('related_operation_id', $request->integer('related_operation_id'));
        }

        $limit = min($request->integer('limit', 80), 200);

        return PlatformNotificationResource::collection($query->limit($limit)->get());
    }

    public function store(StorePlatformNotificationRequest $request)
    {
        $notification = PlatformNotification::create($request->validated());

        return (new PlatformNotificationResource($notification->load('relatedOperation')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(PlatformNotification $platformNotification)
    {
        return new PlatformNotificationResource($platformNotification->load('relatedOperation'));
    }

    public function update(UpdatePlatformNotificationRequest $request, PlatformNotification $platformNotification)
    {
        $platformNotification->update($request->validated());

        return new PlatformNotificationResource($platformNotification->load('relatedOperation'));
    }

    public function destroy(PlatformNotification $platformNotification)
    {
        $platformNotification->delete();

        return response()->json(['message' => 'Notification supprimee.']);
    }

    public function markAsRead(PlatformNotification $platformNotification)
    {
        $platformNotification->markAsRead();

        return new PlatformNotificationResource($platformNotification->load('relatedOperation'));
    }

    public function markAllAsRead(Request $request)
    {
        $roles = $request->user()->getRoleNames()->toArray();

        $updated = PlatformNotification::query()
            ->unread()
            ->whereIn('target_role', $roles)
            ->update(['is_read' => true]);

        return response()->json([
            'message' => 'Notifications marquees comme lues.',
            'updated_count' => $updated,
        ]);
    }
}
