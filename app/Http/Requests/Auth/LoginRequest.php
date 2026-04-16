<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class LoginRequest extends FormRequest
{
    /**
     * Maximum login attempts before lockout.
     */
    const MAX_LOGIN_ATTEMPTS = 5;

    /**
     * First lockout duration in minutes.
     */
    const FIRST_LOCKOUT_MINUTES = 15;

    /**
     * Second and later lockout duration in minutes.
     */
    const SECOND_LOCKOUT_MINUTES = 30;

    /**
     * How long to remember the lockout stage before it resets.
     */
    const LOCKOUT_STAGE_TTL_DAYS = 30;

    /**
     * How long to remember failed attempts before they expire.
     */
    const FAILED_ATTEMPTS_TTL_MINUTES = 30;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];

        // Add reCAPTCHA validation if enabled
        if (admin_setting('recaptcha_enabled') === 'on') {
            $rules['recaptcha_token'] = ['required', 'recaptcha'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'email.required' => __('Email address is required.'),
            'email.string' => __('Email must be a valid string.'),
            'email.email' => __('Please enter a valid email address.'),
            'password.required' => __('Password is required.'),
            'password.string' => __('Password must be a valid string.'),
            'recaptcha_token.required' => __('Please complete the reCAPTCHA verification.'),
            'recaptcha_token.recaptcha' => __('reCAPTCHA verification failed. Please try again.'),
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotLockedOut();

        $inputEmail = Str::lower(trim((string) $this->input('email')));
        $user = User::query()
            ->whereRaw('LOWER(email) = ?', [$inputEmail])
            ->first();

        $credentials = [
            'email' => $user?->email ?? (string) $this->input('email'),
            'password' => (string) $this->input('password'),
        ];

        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            $this->registerFailedAttempt();
        }

        $inputEmail = Str::lower((string) $this->input('email'));
        $authenticatedEmail = Str::lower((string) Auth::user()?->email);

        if ($inputEmail !== $authenticatedEmail) {
            Auth::logout();
            $this->registerFailedAttempt();
        }

        // Check if user account is disabled
        $user = Auth::user();
        if ($user && !$user->is_enable_login) {
            Auth::logout();
            $this->registerFailedAttempt(__('Your account has been disabled. Please contact the administrator.'));
        }

        $this->clearLoginLockoutState();
    }

    /**
     * Ensure the login request is not currently locked.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotLockedOut(): void
    {
        $seconds = $this->remainingLockoutSeconds();

        if ($seconds === null) {
            return;
        }

        event(new Lockout($this));

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        $email = $this->string('email');
        if (empty($email)) {
            $email = 'unknown';
        }
        return Str::transliterate(Str::lower($email).'|'.$this->ip());
    }

    private function registerFailedAttempt(?string $message = null): void
    {
        $attempts = $this->failedAttemptCount() + 1;

        Cache::put($this->failedAttemptKey(), $attempts, now()->addMinutes(self::FAILED_ATTEMPTS_TTL_MINUTES));

        if ($attempts < self::MAX_LOGIN_ATTEMPTS) {
            throw ValidationException::withMessages([
                'email' => $message ?? trans('auth.failed'),
            ]);
        }

        $lockoutMinutes = $this->startLockoutCycle();
        $seconds = $lockoutMinutes * 60;

        event(new Lockout($this));

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => $lockoutMinutes,
            ]),
        ]);
    }

    private function startLockoutCycle(): int
    {
        $cycle = $this->lockoutCycle() + 1;
        $minutes = $cycle === 1 ? self::FIRST_LOCKOUT_MINUTES : self::SECOND_LOCKOUT_MINUTES;
        $expiresAt = now()->addMinutes($minutes);

        Cache::put($this->lockoutCycleKey(), $cycle, now()->addDays(self::LOCKOUT_STAGE_TTL_DAYS));
        Cache::put($this->lockoutUntilKey(), $expiresAt->timestamp, $expiresAt);
        Cache::forget($this->failedAttemptKey());

        return $minutes;
    }

    private function remainingLockoutSeconds(): ?int
    {
        $expiresAt = Cache::get($this->lockoutUntilKey());

        if (! is_numeric($expiresAt)) {
            return null;
        }

        $seconds = (int) $expiresAt - now()->timestamp;

        if ($seconds > 0) {
            return $seconds;
        }

        Cache::forget($this->lockoutUntilKey());

        return null;
    }

    private function failedAttemptCount(): int
    {
        return (int) Cache::get($this->failedAttemptKey(), 0);
    }

    private function lockoutCycle(): int
    {
        return (int) Cache::get($this->lockoutCycleKey(), 0);
    }

    private function clearLoginLockoutState(): void
    {
        Cache::forget($this->failedAttemptKey());
        Cache::forget($this->lockoutUntilKey());
        Cache::forget($this->lockoutCycleKey());
        RateLimiter::clear($this->throttleKey());
    }

    private function failedAttemptKey(): string
    {
        return 'login.failed-attempts.'.$this->throttleKey();
    }

    private function lockoutCycleKey(): string
    {
        return 'login.lockout-cycle.'.$this->throttleKey();
    }

    private function lockoutUntilKey(): string
    {
        return 'login.lockout-until.'.$this->throttleKey();
    }
}
