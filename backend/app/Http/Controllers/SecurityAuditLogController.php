<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSecurityAuditLogRequest;
use App\Http\Requests\UpdateSecurityAuditLogRequest;
use App\Http\Resources\SecurityAuditLogResource;
use App\Models\SecurityAuditLog;
use Illuminate\Http\Request;

class SecurityAuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = SecurityAuditLog::with('actor')->latest('created_at');

        if ($request->filled('action')) {
            $query->where('action', $request->string('action'));
        }

        if ($request->filled('actor_id')) {
            $query->where('actor_id', $request->integer('actor_id'));
        }

        $limit = min($request->integer('limit', SecurityAuditLog::MAX_ENTRIES), SecurityAuditLog::MAX_ENTRIES);

        return SecurityAuditLogResource::collection($query->limit($limit)->get());
    }

    public function store(StoreSecurityAuditLogRequest $request)
    {
        $log = SecurityAuditLog::create([
            ...$request->validated(),
            'actor_id' => $request->user()->id,
            'metadata' => array_merge($request->input('metadata', []), array_filter([
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ])),
        ]);

        SecurityAuditLog::pruneExcess();

        return (new SecurityAuditLogResource($log->load('actor')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(SecurityAuditLog $securityAuditLog)
    {
        return new SecurityAuditLogResource($securityAuditLog->load('actor'));
    }

    public function update(UpdateSecurityAuditLogRequest $request, SecurityAuditLog $securityAuditLog)
    {
        $securityAuditLog->update($request->validated());

        return new SecurityAuditLogResource($securityAuditLog->load('actor'));
    }

    public function destroy(SecurityAuditLog $securityAuditLog)
    {
        $securityAuditLog->delete();

        return response()->json(['message' => 'Entree de journal supprimee.']);
    }
}
