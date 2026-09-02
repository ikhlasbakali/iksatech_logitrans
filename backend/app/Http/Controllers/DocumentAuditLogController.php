<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentAuditLogRequest;
use App\Http\Requests\UpdateDocumentAuditLogRequest;
use App\Http\Resources\DocumentAuditLogResource;
use App\Models\DocumentAuditLog;
use Illuminate\Http\Request;

class DocumentAuditLogController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', DocumentAuditLog::class);

        $query = DocumentAuditLog::with(['document.operation', 'actor']);

        if ($request->filled('document_id')) {
            $query->where('document_id', $request->integer('document_id'));
        }

        if ($request->filled('action')) {
            $query->where('action', $request->string('action'));
        }

        return DocumentAuditLogResource::collection($query->latest('created_at')->get());
    }

    public function store(StoreDocumentAuditLogRequest $request)
    {
        $this->authorize('create', DocumentAuditLog::class);

        $log = DocumentAuditLog::create([
            ...$request->validated(),
            'actor_id' => $request->user()->id,
        ]);

        return (new DocumentAuditLogResource($log->load(['document.operation', 'actor'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(DocumentAuditLog $documentAuditLog)
    {
        $this->authorize('view', $documentAuditLog);

        return new DocumentAuditLogResource(
            $documentAuditLog->load(['document.operation', 'actor'])
        );
    }

    public function update(UpdateDocumentAuditLogRequest $request, DocumentAuditLog $documentAuditLog)
    {
        $this->authorize('update', $documentAuditLog);

        $documentAuditLog->update($request->validated());

        return new DocumentAuditLogResource(
            $documentAuditLog->load(['document.operation', 'actor'])
        );
    }

    public function destroy(DocumentAuditLog $documentAuditLog)
    {
        $this->authorize('delete', $documentAuditLog);

        $documentAuditLog->delete();

        return response()->json(['message' => 'Journal d\'audit supprime.']);
    }
}
