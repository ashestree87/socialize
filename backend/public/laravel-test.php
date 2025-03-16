<?php

// Bootstrap Laravel
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

// Get the kernel
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Create a request
$request = Illuminate\Http\Request::capture();

// Get all routes
$routes = [];
foreach ($app->make('router')->getRoutes() as $route) {
    $routes[] = [
        'methods' => $route->methods(),
        'uri' => $route->uri(),
        'name' => $route->getName(),
        'action' => $route->getActionName(),
    ];
}

// Output the routes
header('Content-Type: application/json');
echo json_encode([
    'total_routes' => count($routes),
    'routes' => $routes,
    'api_routes' => array_filter($routes, function ($route) {
        return strpos($route['uri'], 'api/') === 0;
    }),
]); 