<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_email_that_has_different_letter_case(): void
    {
        $user = User::factory()->create([
            'email' => 'DeepFreeze@EyeCo.com',
        ]);

        $this->post('/login', [
            'email' => 'DeepFREEZE@EyeCo.com',
            'password' => 'password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_login_lockout_escalates_from_fifteen_minutes_to_thirty_minutes(): void
    {
        $user = User::factory()->create();

        for ($attempt = 1; $attempt < self::LOCKOUT_ATTEMPTS; $attempt++) {
            $this->attemptLogin($user, 'wrong-password')
                ->assertStatus(422)
                ->assertJsonValidationErrors('email');
        }

        $firstLockout = $this->attemptLogin($user, 'wrong-password');
        $firstLockout->assertStatus(422)->assertJsonValidationErrors('email');
        $this->assertSame(
            __('Too many login attempts. Please try again in :time.', ['time' => '15m 00s']),
            $firstLockout->json('errors.email.0')
        );

        $this->attemptLogin($user, 'password')
            ->assertStatus(422)
            ->assertJsonValidationErrors('email');

        $this->travel(15)->minutes();
        $this->travel(1)->second();

        for ($attempt = 1; $attempt < self::LOCKOUT_ATTEMPTS; $attempt++) {
            $this->attemptLogin($user, 'wrong-password')
                ->assertStatus(422)
                ->assertJsonValidationErrors('email');
        }

        $secondLockout = $this->attemptLogin($user, 'wrong-password');
        $secondLockout->assertStatus(422)->assertJsonValidationErrors('email');
        $this->assertSame(
            __('Too many login attempts. Please try again in :time.', ['time' => '30m 00s']),
            $secondLockout->json('errors.email.0')
        );
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }

    private const LOCKOUT_ATTEMPTS = 5;

    private function attemptLogin(User $user, string $password)
    {
        return $this->withHeader('Accept', 'application/json')->post('/login', [
            'email' => $user->email,
            'password' => $password,
        ]);
    }
}
