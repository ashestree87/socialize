<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContentUploadController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\SocialPlatformController;
use App\Http\Controllers\Api\TenantController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Tenant routes (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('tenants', TenantController::class);
    });
    
    // Role routes (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('roles', RoleController::class);
        Route::post('/roles/assign', [RoleController::class, 'assignRole']);
        Route::post('/roles/remove', [RoleController::class, 'removeRole']);
    });
    
    // Social platform routes
    Route::apiResource('social-platforms', SocialPlatformController::class);
    
    // Content upload routes
    Route::apiResource('content-uploads', ContentUploadController::class);
    Route::get('/content-uploads/{id}/download', [ContentUploadController::class, 'download']);
    Route::post('/content-uploads/{id}/publish', [ContentUploadController::class, 'publish']);
}); 