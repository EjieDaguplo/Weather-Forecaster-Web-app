<?php
namespace App\Core;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth
{
    private static function getSecret(): string
    {
        return $_ENV['JWT_SECRET'] ?? getenv('JWT_SECRET') ?? 'fallback_secret';
    }

    private static function getExpiry(): int
    {
        return (int)($_ENV['JWT_EXPIRY'] ?? getenv('JWT_EXPIRY') ?? 604800);
    }

    public static function generateToken(array $payload): string
    {
        $payload = array_merge($payload, [
            'iat' => time(),
            'exp' => time() + self::getExpiry(),
        ]);
        return JWT::encode($payload, self::getSecret(), 'HS256');
    }

    public static function verifyToken(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key(self::getSecret(), 'HS256'));
            return (array)$decoded;
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function requireAuth(): array
    {
        $token = Request::bearerToken();
        if (!$token) {
            Response::unauthorized('No token provided');
            exit();
        }

        $payload = self::verifyToken($token);
        if (!$payload) {
            Response::unauthorized('Invalid or expired token');
            exit();
        }

        return $payload;
    }

    public static function requireAdmin(): array
    {
        $payload = self::requireAuth();
        if (($payload['role'] ?? '') !== 'admin') {
            Response::forbidden('Admin access required');
            exit();
        }
        return $payload;
    }
}