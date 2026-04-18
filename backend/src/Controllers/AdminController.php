<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Core\Database;
use App\Core\Request;
use App\Core\Response;

class AdminController
{
    public function listUsers(): void
    {
        Auth::requireAdmin();
        $db = Database::getInstance();
        $users = $db->query('users', [
            'select' => 'id,username,role,created_at',
            'order'  => 'created_at.desc',
        ]);
        Response::json(['users' => $users]);
    }

    public function createUser(): void
    {
        Auth::requireAdmin();
        $body = Request::body();

        $username = trim($body['username'] ?? '');
        $password = $body['password'] ?? '';
        $role     = $body['role'] ?? 'user';

        if (empty($username) || empty($password)) {
            Response::error('Username and password are required');
            return;
        }

        if (!in_array($role, ['user', 'admin'])) {
            Response::error('Invalid role');
            return;
        }

        $db = Database::getInstance();

        // Check duplicate
        $existing = $db->query('users', ['username' => "eq.$username", 'select' => 'id']);
        if (!empty($existing)) {
            Response::error('Username already exists', 409);
            return;
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $user = $db->insert('users', [
            'username'      => $username,
            'password_hash' => $hash,
            'role'          => $role,
            'created_at'    => date('c'),
        ]);

        $created = $user[0] ?? [];
        unset($created['password_hash']);
        Response::json($created, 201);
    }

    public function updateUser(string $id): void
    {
        Auth::requireAdmin();
        $body = Request::body();
        $db = Database::getInstance();

        $data = [];

        if (isset($body['username'])) {
            $username = trim($body['username']);
            if (empty($username)) {
                Response::error('Username cannot be empty');
                return;
            }
            // Check for duplicate username (excluding current user)
            $existing = $db->query('users', [
                'username' => "eq.$username",
                'id'       => "neq.$id",
                'select'   => 'id',
            ]);
            if (!empty($existing)) {
                Response::error('Username already taken', 409);
                return;
            }
            $data['username'] = $username;
        }

        if (isset($body['role'])) {
            if (!in_array($body['role'], ['user', 'admin'])) {
                Response::error('Invalid role');
                return;
            }
            $data['role'] = $body['role'];
        }

        if (!empty($body['password'])) {
            $data['password_hash'] = password_hash($body['password'], PASSWORD_BCRYPT);
        }

        if (empty($data)) {
            Response::error('Nothing to update');
            return;
        }

        $updated = $db->update('users', $data, ['id' => "eq.$id"]);
        $u = $updated[0] ?? [];
        unset($u['password_hash']);
        Response::json($u);
    }

    public function deleteUser(string $id): void
    {
        Auth::requireAdmin();
        $db = Database::getInstance();
        $db->delete('users', ['id' => "eq.$id"]);
        Response::json(['message' => 'User deleted']);
    }

    public function stats(): void
    {
        Auth::requireAdmin();
        $db = Database::getInstance();

        $users       = $db->query('users', ['select' => 'id']);
        $predictions = $db->query('weather_predictions', ['select' => 'id']);
        $today       = $db->query('weather_predictions', [
            'select'     => 'id',
            'created_at' => 'gte.' . date('Y-m-d'),
        ]);

        Response::json([
            'total_users'        => count($users),
            'total_predictions'  => count($predictions),
            'predictions_today'  => count($today),
            'db_records'         => count($users) + count($predictions),
        ]);
    }
}