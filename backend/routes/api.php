<?php
// routes/api.php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/operations', [OperationController::class, 'index']);

    Route::middleware('role:admin')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
    });
});