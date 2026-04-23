<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\EmailTemplate;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response|RedirectResponse
    {
        // Check if registration is enabled
        $enableRegistration = admin_setting('enableRegistration');

        if ($enableRegistration !== 'on') {
            return redirect()->route('login');
        }

        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Check if registration is enabled
        $enableRegistration = admin_setting('enableRegistration');

        if ($enableRegistration !== 'on') {
            return redirect()->route('login');
        }

        $request->validate([
            'name' => ['required', 'string', 'max:27', 'regex:/.*\S.*/'],
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'name.max' => __('Name must not exceed 27 characters.'),
            'name.regex' => __('Name cannot be blank.'),
        ]);

        try {
            $enableEmailVerification = admin_setting('enableEmailVerification');

            $adminUser = User::where('type', 'superadmin')->first();

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'email_verified_at' => $enableEmailVerification === 'on' ? null : now(),
                'type' => 'company',
                'lang' => $adminUser->lang,
                'created_by' => $adminUser ? $adminUser->id : null,
            ]);

            User::CompanySetting($user->id);
            User::MakeRole($user->id);
            $user->assignRole($user->type);

                $freePlan = Plan::where('free_plan', 1)->where('status', 1)->first();
                if ($freePlan) {
                    $counter = [
                        'user_counter' => $freePlan->number_of_users ?? '0',
                        'storage_limit' => $freePlan->storage_limit ?? '0',
                    ];

                    assignPlan(
                        $freePlan->id,
                        null,
                        implode(',', $freePlan->modules ?? []),
                        $counter,
                        $user->id
                    );
                }

            Auth::login($user);

             // Send welcome email
            if(admin_setting('New User') == 'on') {
                $emailData = [
                    'name' => $user->name,
                    'email' => $user->email,
                    'password' => $request->password,
                ];

                EmailTemplate::sendEmailTemplate('New User', [$user->email], $emailData, $adminUser->id);
            }

            if ($enableEmailVerification === 'on') {
                // Apply dynamic mail configuration
                SetConfigEmail($adminUser->id);
                $user->sendEmailVerificationNotification();
                return redirect(route('verification.notice'))->with('status', 'verification-link-sent');
            }

            return redirect(route('dashboard', absolute: false));

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Registration failed. Please try again.']);
        }
    }
}
