<?php
// routes/api.php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\OperationEventController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SalesQuoteController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentAuditLogController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\CustomsCheckpointController;
use App\Http\Controllers\PlatformNotificationController;
use App\Http\Controllers\WorkflowRuleController;
use App\Http\Controllers\SecurityAuditLogController;
use App\Http\Controllers\AppControlSettingsController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('clients', ClientController::class);
    Route::apiResource('sales-quotes', SalesQuoteController::class);
    Route::apiResource('messages', MessageController::class);
    Route::apiResource('drivers', DriverController::class);
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('operations', OperationController::class);
    Route::apiResource('operation-events', OperationEventController::class);
    Route::apiResource('documents', DocumentController::class);
    Route::apiResource('document-audit-logs', DocumentAuditLogController::class);
    Route::apiResource('incidents', IncidentController::class);
    Route::apiResource('customs-checkpoints', CustomsCheckpointController::class);

    Route::post('platform-notifications/mark-all-as-read', [PlatformNotificationController::class, 'markAllAsRead']);
    Route::post('platform-notifications/{platform_notification}/mark-as-read', [PlatformNotificationController::class, 'markAsRead']);
    Route::apiResource('platform-notifications', PlatformNotificationController::class);

    Route::apiResource('workflow-rules', WorkflowRuleController::class);
    Route::apiResource('security-audit-logs', SecurityAuditLogController::class);

    Route::get('app-control-settings/current', [AppControlSettingsController::class, 'current']);
    Route::apiResource('app-control-settings', AppControlSettingsController::class);

    Route::middleware('role:admin')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
    });
});