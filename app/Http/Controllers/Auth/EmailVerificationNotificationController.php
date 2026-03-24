<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }
        
        try {
            SetConfigEmail(creatorId());
            $request->user()->sendEmailVerificationNotification();
            
            
            return back()->with('status', 'verification-link-sent');
            
        } catch (\Throwable $exception) {
            Log::error('Verification email send failed.', [
                'user_id' => $request->user()->id,
                'email' => $request->user()->email,
                'message' => $exception->getMessage(),
            ]);
            
            
            return back()->withErrors(['email' => 'Failed to send verification email. Please try again later.']);
        }
    }
}
