<?php

// Simple API test script
header('Content-Type: application/json');
echo json_encode([
    'message' => 'API test script is working',
    'time' => date('Y-m-d H:i:s'),
    'php_version' => PHP_VERSION,
    'server' => $_SERVER,
]); 