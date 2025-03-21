<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ExecutionTimeServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Set PHP execution time limit to 5 minutes
        set_time_limit(300);
        ini_set('max_execution_time', 300);
        ini_set('max_input_time', 300);
        ini_set('memory_limit', '256M');
    }
}