<?php

namespace App\Providers;

use GuzzleHttp\Client;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\RetryMiddleware;
use Illuminate\Support\ServiceProvider;

class GuzzleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(Client::class, function ($app) {
            $stack = HandlerStack::create();

            // Add retry middleware
            $stack->push(Middleware::retry(function ($retries, $request, $response) {
                // Retry on timeout or server errors
                return $retries < 3 && (
                    $response === null ||
                    $response->getStatusCode() >= 500
                );
            }, function ($retries) {
                // Exponential backoff
                return 1000 * (2 ** $retries);
            }));

            return new Client([
                'handler' => $stack,
                'timeout' => 60,
                'connect_timeout' => 10,
                'read_timeout' => 60,
                'http_errors' => false,
                'verify' => true,
                'curl' => [
                    CURLOPT_TCP_KEEPALIVE => 1,
                    CURLOPT_TCP_KEEPIDLE => 60,
                    CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                    CURLOPT_DNS_USE_GLOBAL_CACHE => true,
                    CURLOPT_DNS_CACHE_TIMEOUT => 600,
                ],
            ]);
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}