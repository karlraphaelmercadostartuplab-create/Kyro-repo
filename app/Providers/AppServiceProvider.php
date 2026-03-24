<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Vite;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // In some shared-hosting deployments (e.g., cPanel), a stray `public/hot`
        // file can be uploaded accidentally. When that happens, Laravel will try to
        // load assets from a dev server URL instead of `public/build`, making it
        // look like front-end changes were not deployed.
        //
        // In production we force a non-public hot-file location so deployed builds
        // are always loaded from the compiled manifest.
        if ($this->app->isProduction()) {
            Vite::useHotFile(storage_path('framework/vite.hot'));
        }
    }
}
