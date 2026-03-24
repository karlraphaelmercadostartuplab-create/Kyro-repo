<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        if(Auth::user()->can('change-password-profile')){
            $validated = $request->validate([
                'current_password' => ['required', 'current_password'],
                'password' => [
                    'required',
                    Password::defaults(),
                    'confirmed',
                    function (string $attribute, mixed $value, \Closure $fail) use ($request) {
                        if (Hash::check($value, $request->user()->password)) {
                            $fail("Password can't be the same as the current password.");
                        }
                    },
                ],
            ]);

            $request->user()->update([
                'password' => Hash::make($validated['password']),
            ]);

            return back()->with('success', __('Password updated successfully.'));
        }
        else{
            return back()->with('error', __('Permission denied'));
        }
    }
}
