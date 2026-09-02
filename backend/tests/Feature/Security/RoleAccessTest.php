<?php

namespace Tests\Feature\Security;

use App\Models\AppControlSettings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesTmsFixtures;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use CreatesTmsFixtures;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRoles();
    }

    public function test_admin_can_access_administration_endpoints(): void
    {
        $admin = $this->createUserWithRole('admin');

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/users')
            ->assertOk();

        AppControlSettings::create(['role_module_grants' => null]);

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/app-control-settings')
            ->assertOk();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/security-audit-logs')
            ->assertOk();
    }

    public function test_client_can_view_own_operations_quotes_documents_and_messages(): void
    {
        [$clientUser, $client] = $this->createClientAccount();
        $staff = $this->createUserWithRole('agent');

        $operation = $this->createOperation($client);
        $quote = $this->createSalesQuote($client, $staff);
        $document = $this->createDocument($operation, $staff);
        $message = $this->createMessage($operation, $staff);

        $this->actingAs($clientUser, 'sanctum')
            ->getJson('/api/operations')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $operation->id);

        $this->actingAs($clientUser, 'sanctum')
            ->getJson('/api/operations/' . $operation->id)
            ->assertOk()
            ->assertJsonPath('data.id', $operation->id);

        $this->actingAs($clientUser, 'sanctum')
            ->getJson('/api/sales-quotes')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $quote->id);

        $this->actingAs($clientUser, 'sanctum')
            ->getJson('/api/documents')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $document->id);

        $this->actingAs($clientUser, 'sanctum')
            ->getJson('/api/messages')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $message->id);
    }

    public function test_client_cannot_view_another_clients_operation_or_restricted_routes(): void
    {
        [$clientUser] = $this->createClientAccount();
        [$otherClientUser, $otherClient] = $this->createClientAccount();
        $staff = $this->createUserWithRole('agent');

        $foreignOperation = $this->createOperation($otherClient);

        $this->actingAs($clientUser, 'sanctum')
            ->getJson('/api/operations/' . $foreignOperation->id)
            ->assertForbidden();

        $this->actingAs($clientUser, 'sanctum')
            ->getJson('/api/vehicles')
            ->assertForbidden();

        $this->actingAs($clientUser, 'sanctum')
            ->getJson('/api/users')
            ->assertForbidden();
    }

    public function test_driver_can_view_and_patch_assigned_operation_but_not_foreign_or_delete(): void
    {
        [$driverUser, $driver] = $this->createDriverAccount();
        [$otherDriverUser, $otherDriver] = $this->createDriverAccount();
        [$clientUser, $client] = $this->createClientAccount();

        $assignedOperation = $this->createOperation($client, [
            'driver_1_id' => $driver->id,
            'status' => 'in_transit',
        ]);

        $foreignOperation = $this->createOperation($client, [
            'driver_1_id' => $otherDriver->id,
            'status' => 'in_transit',
        ]);

        $this->actingAs($driverUser, 'sanctum')
            ->getJson('/api/operations')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $assignedOperation->id);

        $this->actingAs($driverUser, 'sanctum')
            ->getJson('/api/operations/' . $assignedOperation->id)
            ->assertOk();

        $this->actingAs($driverUser, 'sanctum')
            ->patchJson('/api/operations/' . $assignedOperation->id, [
                'current_lat' => 48.8566,
                'current_lng' => 2.3522,
            ])
            ->assertOk();

        $assignedOperation->refresh();
        $this->assertEquals(48.8566, (float) $assignedOperation->current_lat);
        $this->assertEquals(2.3522, (float) $assignedOperation->current_lng);

        $this->actingAs($driverUser, 'sanctum')
            ->getJson('/api/operations/' . $foreignOperation->id)
            ->assertForbidden();

        $this->actingAs($driverUser, 'sanctum')
            ->deleteJson('/api/operations/' . $assignedOperation->id)
            ->assertForbidden();
    }
}
