<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppControlSettingsRequest;
use App\Http\Requests\UpdateAppControlSettingsRequest;
use App\Http\Resources\AppControlSettingsResource;
use App\Models\AppControlSettings;
use App\Models\SecurityAuditLog;
use Illuminate\Http\Request;

class AppControlSettingsController extends Controller
{
    public function index()
    {
        return AppControlSettingsResource::collection(
            AppControlSettings::query()->latest('updated_at')->get()
        );
    }

    public function store(StoreAppControlSettingsRequest $request)
    {
        $settings = AppControlSettings::create($request->validated());

        $this->recordSettingsAudit($request, 'settings.created', [
            'role_module_grants' => $settings->role_module_grants,
        ]);

        return (new AppControlSettingsResource($settings))
            ->response()
            ->setStatusCode(201);
    }

    public function show(AppControlSettings $appControlSetting)
    {
        return new AppControlSettingsResource($appControlSetting);
    }

    public function current()
    {
        $settings = AppControlSettings::query()->latest('updated_at')->first();

        if (!$settings) {
            return response()->json(['data' => null]);
        }

        return new AppControlSettingsResource($settings);
    }

    public function update(UpdateAppControlSettingsRequest $request, AppControlSettings $appControlSetting)
    {
        $previous = $appControlSetting->role_module_grants;

        $appControlSetting->update($request->validated());

        $this->recordSettingsAudit($request, 'settings.module_grants', [
            'previous' => $previous,
            'next' => $appControlSetting->role_module_grants,
        ]);

        return new AppControlSettingsResource($appControlSetting);
    }

    public function destroy(AppControlSettings $appControlSetting)
    {
        $appControlSetting->delete();

        return response()->json(['message' => 'Parametres supprimes.']);
    }

    private function recordSettingsAudit(Request $request, string $action, array $metadata): void
    {
        SecurityAuditLog::create([
            'actor_id' => $request->user()->id,
            'action' => $action,
            'target_type' => AppControlSettings::class,
            'metadata' => $metadata,
        ]);

        SecurityAuditLog::pruneExcess();
    }
}
