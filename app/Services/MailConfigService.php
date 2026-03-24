<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MailConfigService
{
    public static function setDynamicConfig($userId = null): bool
    {
        $superadminId = User::query()->where('type', 'superadmin')->value('id');
        
        if (empty($userId)) {
            $userId = auth()->id() ?: $superadminId;
        }

        if (empty($userId) && empty($superadminId)) {
            return false;
        }

        $settings = self::resolveMailSettings((int) $userId, $superadminId ? (int) $superadminId : null);

        if (blank($settings->get('email_host'))) {
            return false;
        }

        $driver = $settings->get('email_driver', 'smtp');
        $encryption = $settings->get('email_encryption', 'tls');

        if (in_array($encryption, ['none', '', null], true)) {
            $encryption = null;
        }
        
        

        Config::set([
            'mail.default' => $driver ?: 'smtp',
            'mail.mailers.smtp.host' => $settings->get('email_host'),
            'mail.mailers.smtp.port' => (int) $settings->get('email_port', 587),
            'mail.mailers.smtp.encryption' => $encryption,
            'mail.mailers.smtp.username' => $settings->get('email_username', ''),
            'mail.mailers.smtp.password' => $settings->get('email_password', ''),
            'mail.from.address' => $settings->get('email_fromAddress', 'noreply@example.com'),
            'mail.from.name' => $settings->get('email_fromName', config('app.name', 'APP_NAME')),
        ]);
        try {
            app('mail.manager')->forgetMailers();
            app()->forgetInstance('mailer');
            Mail::purge();
        } catch (\Throwable $exception) {
            Log::warning('Unable to purge resolved mailers after dynamic mail config update.', [
                'message' => $exception->getMessage(),
            ]);
        }

        return true;
    }

    private static function resolveMailSettings(int $ownerId, ?int $superadminId): Collection
    {
        $ownerSettings = DB::table('settings')
            ->where('created_by', $ownerId)
            ->where('key', 'like', 'email_%')
            ->pluck('value', 'key');

        if ($superadminId && $superadminId !== $ownerId) {
            $superadminSettings = DB::table('settings')
                ->where('created_by', $superadminId)
                ->where('key', 'like', 'email_%')
                ->pluck('value', 'key');

            return $superadminSettings->merge($ownerSettings);
        }

        return $ownerSettings;
    }
    
}