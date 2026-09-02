<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Models\DocumentAuditLog;
use App\Models\OperationEvent;
use App\Support\AccessScope;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    private const DISK = 'public';

    public function index(Request $request)
    {
        $this->authorize('viewAny', Document::class);

        $query = Document::with('operation', 'uploadedBy', 'validatedBy', 'rejectedBy');

        if ($request->user()->hasRole('client')) {
            AccessScope::scopeThroughOperation($query, $request->user());
        }

        if ($request->filled('operation_id')) {
            $query->where('operation_id', $request->integer('operation_id'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return DocumentResource::collection($query->latest()->get());
    }

    public function store(StoreDocumentRequest $request)
    {
        $this->authorize('create', Document::class);

        $file = $request->file('file');
        $operationId = $request->integer('operation_id');
        $storedPath = $this->storeUploadedFile($file, $operationId);

        $document = Document::create([
            'operation_id' => $operationId,
            'type' => $request->string('type'),
            'name' => $request->input('name') ?: $file->getClientOriginalName(),
            'file_path' => $storedPath,
            'file_url' => Storage::disk(self::DISK)->url($storedPath),
            'uploaded_by' => $request->user()->id,
            'status' => 'pending',
            'notes' => $request->input('notes'),
            'metadata' => $request->input('metadata'),
        ]);

        OperationEvent::create([
            'operation_id' => $document->operation_id,
            'type' => 'document_added',
            'title' => 'Piece jointe — ' . $document->type,
            'description' => $document->name . ' — depose par ' . $request->user()->name,
            'actor' => $request->user()->id,
            'metadata' => [
                'document_id' => $document->id,
                'document_type' => $document->type,
            ],
        ]);

        $this->recordAuditLog($document, 'uploaded', $request->user()->id);

        return (new DocumentResource($document->load('operation', 'uploadedBy')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Document $document)
    {
        $this->authorize('view', $document);

        return new DocumentResource(
            $document->load('operation', 'uploadedBy', 'validatedBy', 'rejectedBy')
        );
    }

    public function update(UpdateDocumentRequest $request, Document $document)
    {
        $this->authorize('update', $document);

        $data = $request->validated();

        if ($request->hasFile('file')) {
            $this->deleteStoredFile($document->file_path);
            $storedPath = $this->storeUploadedFile($request->file('file'), $document->operation_id);
            $data['file_path'] = $storedPath;
            $data['file_url'] = Storage::disk(self::DISK)->url($storedPath);
            $data['status'] = 'pending';
            $data['validated_by'] = null;
            $data['validated_at'] = null;
            $data['rejected_by'] = null;
            $data['rejected_at'] = null;
        }

        unset($data['file']);

        $previousStatus = $document->status;

        if (isset($data['status']) && $data['status'] !== $previousStatus) {
            $this->applyStatusTransition($data, $request->user()->id);
        }

        $document->update($data);

        if (isset($data['status']) && $data['status'] !== $previousStatus) {
            $this->recordStatusChangeEvent($document, $request->user());

            $auditAction = match ($document->status) {
                'validated' => 'validated',
                'rejected' => 'rejected',
                default => null,
            };

            if ($auditAction) {
                $this->recordAuditLog($document, $auditAction, $request->user()->id);
            }
        }

        return new DocumentResource(
            $document->load('operation', 'uploadedBy', 'validatedBy', 'rejectedBy')
        );
    }

    public function destroy(Document $document)
    {
        $this->authorize('delete', $document);

        $this->deleteStoredFile($document->file_path);
        $document->delete();

        return response()->json(['message' => 'Document supprime.']);
    }

    private function storeUploadedFile($file, int $operationId): string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid() . ($extension ? '.' . $extension : '');

        return Storage::disk(self::DISK)->putFileAs(
            'documents/' . $operationId,
            $file,
            $filename
        );
    }

    private function deleteStoredFile(?string $path): void
    {
        if ($path && Storage::disk(self::DISK)->exists($path)) {
            Storage::disk(self::DISK)->delete($path);
        }
    }

    private function applyStatusTransition(array &$data, int $userId): void
    {
        if ($data['status'] === 'validated') {
            $data['validated_by'] = $userId;
            $data['validated_at'] = now();
            $data['rejected_by'] = null;
            $data['rejected_at'] = null;
        } elseif ($data['status'] === 'rejected') {
            $data['rejected_by'] = $userId;
            $data['rejected_at'] = now();
            $data['validated_by'] = null;
            $data['validated_at'] = null;
        } elseif ($data['status'] === 'pending') {
            $data['validated_by'] = null;
            $data['validated_at'] = null;
            $data['rejected_by'] = null;
            $data['rejected_at'] = null;
        }
    }

    private function recordStatusChangeEvent(Document $document, $user): void
    {
        $title = match ($document->status) {
            'validated' => 'Document valide',
            'rejected' => 'Document rejete',
            default => 'Document — mise a jour',
        };

        OperationEvent::create([
            'operation_id' => $document->operation_id,
            'type' => 'status_change',
            'title' => $title,
            'description' => $document->type . ' — ' . $document->name,
            'actor' => $user->id,
            'metadata' => [
                'document_id' => $document->id,
                'document_type' => $document->type,
            ],
        ]);
    }

    private function recordAuditLog(Document $document, string $action, int $actorId): void
    {
        DocumentAuditLog::create([
            'document_id' => $document->id,
            'action' => $action,
            'actor_id' => $actorId,
        ]);
    }
}
