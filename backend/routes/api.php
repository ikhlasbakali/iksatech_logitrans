<?php
// routes/api.php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SalesQuoteController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/operations', [OperationController::class, 'index']);

    Route::apiResource('clients', ClientController::class);
    Route::apiResource('sales-quotes', SalesQuoteController::class);
    Route::apiResource('messages', MessageController::class);
    Route::apiResource('drivers', DriverController::class);
    Route::apiResource('vehicles', VehicleController::class);

    Route::middleware('role:admin')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
    });
});