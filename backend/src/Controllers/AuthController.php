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
        // ── Register ─────────────────────────────────────────────────────────────
    public function register(): void
    {
        $body     = Request::body();
        $username = trim($body['username'] ?? '');
        $email    = trim($body['email']    ?? '');
        $password = $body['password']      ?? '';

        // ── Validation ───────────────────────────────────────────────────────
        if (empty($username) || empty($password) || empty($email)) {
            Response::error('Username, email and password are required');
            return;
        }

        if (strlen($username) < 3 || strlen($username) > 30) {
            Response::error('Username must be between 3 and 30 characters');
            return;
        }

        if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
            Response::error('Username can only contain letters, numbers and underscores');
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email address');
            return;
        }

        if (strlen($password) < 6) {
            Response::error('Password must be at least 6 characters');
            return;
        }

        $db = Database::getInstance();

        //Check duplicate username
        $existingUsername = $db->query('users', [
            'username' => "eq.$username",
            'select'   => 'id',
        ]);

        if (!empty($existingUsername)) {
            Response::error('Username is already taken', 409);
            return;
        }

        //Check duplicate email
        $existingEmail = $db->query('users', [
            'email'  => "eq.$email",
            'select' => 'id',
        ]);

        if (!empty($existingEmail)) {
            Response::error('Email is already registered', 409);
            return;
        }

        //Create user
        $hash    = password_hash($password, PASSWORD_BCRYPT);
        $created = $db->insert('users', [
            'username'      => $username,
            'email'         => $email,
            'password_hash' => $hash,
            'role'          => 'user',       // always register as user
            'created_at'    => date('c'),
        ]);

        $newUser = $created[0] ?? [];
        unset($newUser['password_hash']);

        Response::json([
            'message' => 'Account created successfully',
            'user'    => $newUser,
        ], 201);
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