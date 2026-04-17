<?php
namespace App\Core;

class Database
{
    private static ?Database $instance = null;
    private string $baseUrl;
    private string $apiKey;

    private function __construct()
    {
        $this->baseUrl = rtrim($_ENV['SUPABASE_URL'], '/') . '/rest/v1';
        $this->apiKey = $_ENV['SUPABASE_ANON_KEY']; 
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
        //     if (!empty($params)) {
        //     $url .= '?' . http_build_query($params);
        // }
            // http_build_query encodes dots as %2E, breaking PostgREST operators
            // like eq.value, gt.value, etc. Build the query string manually.
            $parts = [];
            foreach ($params as $key => $value) {
                $parts[] = urlencode($key) . '=' . $value; // value NOT encoded
            }
            $url .= '?' . implode('&', $parts);
        }

        error_log("DEBUG URL: " . $url);
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
    $ch = curl_init($url);
    $headers = [
        "apikey: {$this->apiKey}",
        "Authorization: Bearer {$this->apiKey}",
        "Content-Type: application/json",
        ...$extraHeaders,
    ];

    // Debug cert
    $certPath = realpath(__DIR__ . '/../../cacert.pem');
    error_log("CERT EXISTS: " . (file_exists($certPath) ? 'YES' : 'NO'));
    error_log("CERT PATH: " . $certPath);

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_CAINFO         => $certPath,
    ]);

    if (!empty($body)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }

    // Debug request
    error_log("DEBUG HEADERS SENT: " . implode(' | ', $headers));
    error_log("DEBUG FULL URL: " . $url);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        error_log("CURL ERROR CODE: " . curl_errno($ch));
        error_log("CURL ERROR MSG: " . curl_error($ch));
    }

    // Debug response
    error_log("DEBUG HTTP CODE: " . $httpCode);
    error_log("DEBUG RESPONSE: " . $response);

    curl_close($ch);

    $decoded = json_decode($response, true);

    if ($httpCode >= 400) {
        throw new \RuntimeException($decoded['message'] ?? 'Database error', $httpCode);
    }

    return $decoded ?? [];
}
}