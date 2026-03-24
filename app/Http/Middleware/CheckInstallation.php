<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

class CheckInstallation
{
    public function handle(Request $request, Closure $next)
    {
        if (!$this->isInstalled() && !$request->is('install*')) {
            return redirect()->route('installer.welcome');
        }

        if ($this->isInstalled() && $request->is('install*')) {
            return redirect('/dashboard');
        }

        return $next($request);
    }

    private function isInstalled(): bool
    {
        if (!File::exists(storage_path('installed'))) {
            return false;
        }

        try {
            return Schema::hasTable('users') && Schema::hasTable('settings');
        } catch (\Throwable $e) {
            return false;
        }
    }
}
