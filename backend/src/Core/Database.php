<?php
namespace App\Core;

class Database
{
    private static ?Database $instance = null;
    private string $baseUrl;
    private string $apiKey;

    private function __construct()
    {
        $url    = $_ENV['SUPABASE_URL']  ?? getenv('SUPABASE_URL')  ?? '';
        $key    = $_ENV['SUPABASE_KEY']  ?? getenv('SUPABASE_KEY')  ?? '';

        $this->baseUrl = rtrim($url, '/') . '/rest/v1';
        $this->apiKey  = $key;
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function query(string $table, array $params = []): array
    {
        $url = $this->baseUrl . '/' . $table;
        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }
        return $this->request('GET', $url);
    }

    public function insert(string $table, array $data): array
    {
        $url = $this->baseUrl . '/' . $table;
        return $this->request('POST', $url, $data, ['Prefer: return=representation']);
    }

    public function update(string $table, array $data, array $filters): array
    {
        $url = $this->baseUrl . '/' . $table . '?' . http_build_query($filters);
        return $this->request('PATCH', $url, $data, ['Prefer: return=representation']);
    }

    public function delete(string $table, array $filters): array
    {
        $url = $this->baseUrl . '/' . $table . '?' . http_build_query($filters);
        return $this->request('DELETE', $url);
    }

    private function request(string $method, string $url, array $body = [], array $extraHeaders = []): array
    {
        $ch      = curl_init($url);
        $headers = [
            "apikey: {$this->apiKey}",
            "Authorization: Bearer {$this->apiKey}",
            "Content-Type: application/json",
            ...$extraHeaders,
        ];

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_HTTPHEADER     => $headers,
        ]);

        if (!empty($body)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $decoded = json_decode($response, true);

        if ($httpCode >= 400) {
            throw new \RuntimeException($decoded['message'] ?? 'Database error', $httpCode);
        }

        return $decoded ?? [];
    }
}