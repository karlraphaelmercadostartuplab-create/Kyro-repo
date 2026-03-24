<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ApplyDynamicMailConfig
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $ownerId = Auth::check() ? creatorId() : null;
            SetConfigEmail($ownerId);

            if (config('queue.default') !== 'sync' && config('app.shared_hosting_force_sync_queue', true)) {
                config(['queue.default' => 'sync']);
            }
        } catch (\Throwable $exception) {
            Log::warning('Dynamic mail config could not be applied for current request.', [
                'path' => $request->path(),
                'message' => $exception->getMessage(),
            ]);
        }

        return $next($request);
    }
}