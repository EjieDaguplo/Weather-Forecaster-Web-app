<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Core\Database;
use App\Core\Request;
use App\Core\Response;

class WeatherController
{
    public function current(): void
    {
        Auth::requireAuth();
        $db = Database::getInstance();
        $records = $db->query('weather_data', [
            'select'  => '*',
            'order'   => 'recorded_at.desc',
            'limit'   => '1',
        ]);

        if (empty($records)) {
            Response::json([
                'temperature' => null,
                'humidity'    => null,
                'wind_speed'  => null,
                'condition'   => 'No data',
                'location'    => 'Unknown',
            ]);
            return;
        }

        Response::json($records[0]);
    }

    public function forecast(): void
    {
        Auth::requireAuth();
        $db = Database::getInstance();
        $records = $db->query('weather_forecasts', [
            'select' => 'day,temperature,humidity,condition',
            'order'  => 'forecast_date.asc',
            'limit'  => '7',
        ]);

        Response::json(['forecast' => $records]);
    }

    public function predict(): void
    {
        Auth::requireAuth();
        $payload = Auth::requireAuth();
        $body = Request::body();

        $required = ['temperature', 'humidity', 'wind_speed', 'pressure'];
        foreach ($required as $field) {
            if (!isset($body[$field])) {
                Response::error("Missing field: $field");
                return;
            }
        }

        // Call external AI model
        $aiModelUrl = $_ENV['AI_MODEL_URL'] ?? 'http://localhost:5000/predict';
        $ch = curl_init($aiModelUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($body),
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_TIMEOUT        => 10,
        ]);

        $aiResponse = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($aiResponse === false || $httpCode >= 400) {
            Response::error('AI model unavailable', 503);
            return;
        }

        $result = json_decode($aiResponse, true);

        // Log prediction to DB
        $db = Database::getInstance();
        $db->insert('weather_predictions', [
            'user_id'    => $payload['sub'],
            'input_data' => json_encode($body),
            'prediction' => $result['prediction'] ?? null,
            'confidence' => $result['confidence'] ?? null,
            'created_at' => date('c'),
        ]);

        Response::json($result);
    }

    public function history(): void
    {
        $payload = Auth::requireAuth();
        $db = Database::getInstance();

        $filters = ['user_id' => "eq.{$payload['sub']}", 'order' => 'created_at.desc', 'limit' => '20'];
        if ($payload['role'] === 'admin') {
            unset($filters['user_id']);
        }

        $records = $db->query('weather_predictions', $filters);
        Response::json(['history' => $records]);
    }
}