<?php

namespace Tests\Feature\Domain;

use App\Models\Document;
use App\Models\Incident;
use App\Models\Message;
use App\Models\Operation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesTmsFixtures;
use Tests\TestCase;

class OperationCascadeTest extends TestCase
{
    use CreatesTmsFixtures;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRoles();
    }

    public function test_deleting_operation_cascades_related_documents_incidents_and_messages(): void
    {
        [$clientUser, $client] = $this->createClientAccount();
        $staff = $this->createUserWithRole('agent');

        $operation = $this->createOperation($client);
        $document = $this->createDocument($operation, $staff);
        $incident = $this->createIncident($operation, $staff);
        $message = $this->createMessage($operation, $staff);

        $operation->delete();

        $this->assertDatabaseMissing('operations', ['id' => $operation->id]);
        $this->assertDatabaseMissing('documents', ['id' => $document->id]);
        $this->assertDatabaseMissing('incidents', ['id' => $incident->id]);
        $this->assertDatabaseMissing('messages', ['id' => $message->id]);
    }

    public function test_deleting_driver_or_vehicle_nullifies_operation_foreign_keys(): void
    {
        [$driverUser, $driver] = $this->createDriverAccount();
        [, $secondaryDriver] = $this->createDriverAccount();
        [$clientUser, $client] = $this->createClientAccount();
        $vehicle = $this->createVehicle();

        $operation = $this->createOperation($client, [
            'driver_1_id' => $driver->id,
            'driver_2_id' => $secondaryDriver->id,
            'vehicle_id' => $vehicle->id,
        ]);

        $driver->delete();

        $operation->refresh();
        $this->assertNull($operation->driver_1_id);
        $this->assertSame($secondaryDriver->id, $operation->driver_2_id);
        $this->assertSame($vehicle->id, $operation->vehicle_id);

        $vehicle->delete();

        $operation->refresh();
        $this->assertNull($operation->vehicle_id);
        $this->assertDatabaseHas('operations', ['id' => $operation->id]);
    }
}
