<?php
// Route all requests to index.php for PHP built-in server
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// If the file physically exists (e.g. assets), serve it directly
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// Otherwise send everything to index.php
require_once __DIR__ . '/index.php';