<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Admin Test',
            'email' => 'admin@test.com',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Manager Test',
            'email' => 'manager@test.com',
            'role' => 'manager',
        ]);

        User::factory()->create([
            'name' => 'Exploitation Manager Test',
            'email' => 'exploitation@test.com',
            'role' => 'exploitation_manager',
        ]);

        User::factory()->create([
            'name' => 'Agent Test',
            'email' => 'agent@test.com',
            'role' => 'agent',
        ]);

        User::factory()->create([
            'name' => 'Support Test',
            'email' => 'support@test.com',
            'role' => 'support',
        ]);

        User::factory()->create([
            'name' => 'Client Test',
            'email' => 'client@test.com',
            'role' => 'client',
        ]);

        User::factory()->create([
            'name' => 'Chauffeur Test',
            'email' => 'chauffeur@test.com',
            'role' => 'driver',
        ]);
    }
}