<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Tech Solutions Inc', 'email' => 'admin@techsolutions.com'],
            ['name' => 'Global Marketing Corp', 'email' => 'contact@globalmarketing.com'],
            ['name' => 'Digital Innovations LLC', 'email' => 'info@digitalinnovations.com'],
            ['name' => 'Creative Design Studio', 'email' => 'hello@creativedesign.com'],
            ['name' => 'Business Consulting Group', 'email' => 'support@businessconsulting.com']
        ];

        foreach ($users as $index => $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'mobile_no' => '+1' . sprintf('%010d', 3000000000 + $index),
                'password' => Hash::make('1234'),
                'type' => 'company',
                'lang' => 'en',
                'email_verified_at' => now(),
                'creator_id' => 1,
                'created_by' => 1
            ]);

            $user->assignRole('company');
            User::CompanySetting($user->id);
            // Make Company's role
            User::MakeRole($user->id);
        }
    }
}