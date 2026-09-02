<?php

use App\Http\Controllers\AppControlSettingsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CustomsCheckpointController;
use App\Http\Controllers\DocumentAuditLogController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\OperationEventController;
use App\Http\Controllers\PlatformNotificationController;
use App\Http\Controllers\SalesQuoteController;
use App\Http\Controllers\SecurityAuditLogController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\WorkflowRuleController;
use App\Support\RoleGroups;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::post('platform-notifications/mark-all-as-read', [PlatformNotificationController::class, 'markAllAsRead']);
    Route::post('platform-notifications/{platform_notification}/mark-as-read', [PlatformNotificationController::class, 'markAsRead']);
    Route::apiResource('platform-notifications', PlatformNotificationController::class);

    Route::middleware('role:' . RoleGroups::ADMIN)->group(function () {
        Route::apiResource('security-audit-logs', SecurityAuditLogController::class);
        Route::get('app-control-settings/current', [AppControlSettingsController::class, 'current']);
        Route::apiResource('app-control-settings', AppControlSettingsController::class);
        Route::apiResource('workflow-rules', WorkflowRuleController::class);
        Route::apiResource('users', UserController::class);
    });

    Route::middleware('role:' . RoleGroups::DIRECTION)->group(function () {
        Route::post('operations', [OperationController::class, 'store']);
        Route::put('operations/{operation}', [OperationController::class, 'update']);
        Route::patch('operations/{operation}', [OperationController::class, 'update']);

        Route::apiResource('operation-events', OperationEventController::class)->except(['index', 'show']);
        Route::apiResource('vehicles', VehicleController::class);
        Route::apiResource('drivers', DriverController::class);
        Route::apiResource('customs-checkpoints', CustomsCheckpointController::class);
        Route::apiResource('clients', ClientController::class);
    });

    Route::middleware('role:admin|manager|exploitation_manager|agent')->group(function () {
        Route::post('sales-quotes', [SalesQuoteController::class, 'store']);
        Route::put('sales-quotes/{sales_quote}', [SalesQuoteController::class, 'update']);
        Route::patch('sales-quotes/{sales_quote}', [SalesQuoteController::class, 'update']);
        Route::delete('sales-quotes/{sales_quote}', [SalesQuoteController::class, 'destroy']);
    });

    Route::middleware('role:' . RoleGroups::OPERATORS)->group(function () {
        Route::post('documents', [DocumentController::class, 'store']);
        Route::put('documents/{document}', [DocumentController::class, 'update']);
        Route::patch('documents/{document}', [DocumentController::class, 'update']);
        Route::delete('documents/{document}', [DocumentController::class, 'destroy']);

        Route::apiResource('document-audit-logs', DocumentAuditLogController::class);
        Route::apiResource('incidents', IncidentController::class);
        Route::put('messages/{message}', [MessageController::class, 'update']);
        Route::patch('messages/{message}', [MessageController::class, 'update']);
        Route::delete('messages/{message}', [MessageController::class, 'destroy']);
    });

    Route::middleware('role:' . RoleGroups::OPERATION_READERS)->group(function () {
        Route::get('operations', [OperationController::class, 'index']);
        Route::get('operations/{operation}', [OperationController::class, 'show']);
        Route::delete('operations/{operation}', [OperationController::class, 'destroy']);
    });

    Route::middleware('role:driver')->group(function () {
        Route::patch('operations/{operation}', [OperationController::class, 'update']);
    });

    Route::middleware('role:' . RoleGroups::OPERATION_EVENT_READERS)->group(function () {
        Route::get('operation-events', [OperationEventController::class, 'index']);
        Route::get('operation-events/{operation_event}', [OperationEventController::class, 'show']);
    });

    Route::middleware('role:' . RoleGroups::DOCUMENT_READERS)->group(function () {
        Route::get('documents', [DocumentController::class, 'index']);
        Route::get('documents/{document}', [DocumentController::class, 'show']);
    });

    Route::middleware('role:' . RoleGroups::SALES_QUOTE_READERS)->group(function () {
        Route::get('sales-quotes', [SalesQuoteController::class, 'index']);
        Route::get('sales-quotes/{sales_quote}', [SalesQuoteController::class, 'show']);
    });

    Route::middleware('role:' . RoleGroups::MESSAGE_USERS)->group(function () {
        Route::get('messages', [MessageController::class, 'index']);
        Route::get('messages/{message}', [MessageController::class, 'show']);
        Route::post('messages', [MessageController::class, 'store']);
    });
});
