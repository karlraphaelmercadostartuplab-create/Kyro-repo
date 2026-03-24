<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnforceSessionTimeout
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && Auth::user()->type === 'superadmin') {
            $lastActivity = $request->session()->get('last_activity_at');
            $timeoutSeconds = (int) config('session.lifetime', 120) * 60;

            if ($lastActivity && (time() - (int) $lastActivity) > $timeoutSeconds) {
                $user = Auth::user();
                $user->active_status = 0;
                $user->last_seen_at = now();
                $user->save();

                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('login')->with('error', __('Your session has expired. Please log in again.'));
            }

            $request->session()->put('last_activity_at', time());
        }

        return $next($request);
    }
}
