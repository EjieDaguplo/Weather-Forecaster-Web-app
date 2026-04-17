<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Core\Database;
use App\Core\Request;
use App\Core\Response;

class AuthController
{
    public function login(): void
    {
        $body = Request::body();
        $username = trim($body['username'] ?? '');
        $password = $body['password'] ?? '';

        if (empty($username) || empty($password)) {
            Response::error('Username and password are required');
            return;
        }

        $db = Database::getInstance();
        $users = $db->query('users', [
            'username' => "eq.$username",
            'select' => 'id,username,password_hash,role,created_at',
        ]);

        if (empty($users)) {
            Response::error('Invalid credentials', 401);
            return;
        }

        $user = $users[0];
        if (!password_verify($password, $user['password_hash'])) {
            Response::error('Invalid credentials', 401);
            return;
        }

        $token = Auth::generateToken([
            'sub'      => $user['id'],
            'username' => $user['username'],
            'role'     => $user['role'],
        ]);

        Response::json([
            'token' => $token,
            'user'  => [
                'id'         => $user['id'],
                'username'   => $user['username'],
                'role'       => $user['role'],
                'created_at' => $user['created_at'],
            ],
        ]);
    }

    public function logout(): void
    {
        Auth::requireAuth();
        // JWT is stateless; client removes token
        Response::json(['message' => 'Logged out successfully']);
    }

    public function me(): void
    {
        $payload = Auth::requireAuth();
        $db = Database::getInstance();
        $users = $db->query('users', [
            'id'     => "eq.{$payload['sub']}",
            'select' => 'id,username,role,created_at',
        ]);

        if (empty($users)) {
            Response::error('User not found', 404);
            return;
        }

        Response::json($users[0]);
    }
}