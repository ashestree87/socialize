<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', function () {
    return response()->json(['message' => 'Test route is working']);
});

// Test controller route
Route::get('/test-controller', [TestController::class, 'test']);

// Diagnostic route to check API routes
Route::get('/debug-api', function () {
    $routes = collect(Route::getRoutes())->map(function ($route) {
        return [
            'method' => implode('|', $route->methods()),
            'uri' => $route->uri(),
            'name' => $route->getName(),
            'action' => $route->getActionName(),
        ];
    });
    
    return response()->json([
        'total_routes' => count($routes),
        'api_routes' => $routes->filter(function ($route) {
            return strpos($route['uri'], 'api/') === 0;
        })->values(),
    ]);
});
