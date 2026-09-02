<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed roles
        $this->seed(RoleSeeder::class);
    }

    public function test_active_user_can_login_and_receive_token()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'role' => 'client',
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'role', 'user']);
    }

    public function test_inactive_user_cannot_login()
    {
        $user = User::factory()->create([
            'email' => 'inactive@example.com',
            'password' => Hash::make('password123'),
            'role' => 'client',
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'inactive@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_authenticated_user_can_get_profile()
    {
        $user = User::factory()->create([
            'role' => 'client',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/me');

        $response->assertStatus(200)
            ->assertJsonPath('email', $user->email);
    }

    public function test_client_cannot_access_users_creation()
    {
        $user = User::factory()->create([
            'role' => 'client',
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/users', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'secret123',
            'role' => 'client',
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_access_users_creation()
    {
        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/users', [
            'name' => 'New Driver',
            'email' => 'driver@example.com',
            'password' => 'secret123',
            'role' => 'driver',
        ]);

        $response->assertStatus(201);
    }
}
