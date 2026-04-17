<?php
namespace App\Core;

class Router
{
    private array $routes = [];

    public function get(string $path, string $handler): void
    {
        $this->routes[] = ['GET', $path, $handler];
    }

    public function post(string $path, string $handler): void
    {
        $this->routes[] = ['POST', $path, $handler];
    }

    public function put(string $path, string $handler): void
    {
        $this->routes[] = ['PUT', $path, $handler];
    }

    public function delete(string $path, string $handler): void
    {
        $this->routes[] = ['DELETE', $path, $handler];
    }

    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        foreach ($this->routes as [$routeMethod, $routePath, $handler]) {
            if ($method !== $routeMethod) continue;

            $pattern = preg_replace('/\{[a-zA-Z_]+\}/', '([^/]+)', $routePath);
            $pattern = '@^' . $pattern . '$@';

            if (preg_match($pattern, $uri, $matches)) {
                array_shift($matches);
                [$controllerName, $action] = explode('@', $handler);
                $controllerClass = "App\\Controllers\\$controllerName";

                if (!class_exists($controllerClass)) {
                    http_response_code(500);
                    echo json_encode(['error' => "Controller $controllerClass not found"]);
                    return;
                }

                $controller = new $controllerClass();
                $controller->$action(...$matches);
                return;
            }
        }

        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
    }
}