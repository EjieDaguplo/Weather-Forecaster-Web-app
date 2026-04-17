<?php
namespace App\Core;

class Response
{
    public static function json(mixed $data, int $code = 200): void
    {
        http_response_code($code);
        echo json_encode($data);
        exit();
    }

    public static function error(string $message, int $code = 400): void
    {
        self::json(['message' => $message, 'error' => true], $code);
    }

    public static function unauthorized(string $message = 'Unauthorized'): void
    {
        self::error($message, 401);
    }

    public static function forbidden(string $message = 'Forbidden'): void
    {
        self::error($message, 403);
    }
}