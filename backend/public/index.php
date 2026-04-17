<?php
require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\Router;
use App\Core\Request;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// CORS Headers
$allowedOrigin = $_ENV['CORS_ORIGIN'] ?? 'http://localhost:3000';
header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$router = new Router();

// Auth routes
$router->post('/api/auth/login', 'AuthController@login');
$router->post('/api/auth/logout', 'AuthController@logout');
$router->get('/api/auth/me', 'AuthController@me');

// Weather routes
$router->get('/api/weather/current', 'WeatherController@current');
$router->get('/api/weather/forecast', 'WeatherController@forecast');
$router->post('/api/weather/predict', 'WeatherController@predict');
$router->get('/api/weather/history', 'WeatherController@history');

// Admin routes
$router->get('/api/admin/users', 'AdminController@listUsers');
$router->post('/api/admin/users', 'AdminController@createUser');
$router->put('/api/admin/users/{id}', 'AdminController@updateUser');
$router->delete('/api/admin/users/{id}', 'AdminController@deleteUser');
$router->get('/api/admin/stats', 'AdminController@stats');

$router->dispatch();