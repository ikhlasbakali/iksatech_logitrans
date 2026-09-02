<?php

namespace Tests\Concerns;

use App\Models\Client;
use App\Models\Document;
use App\Models\Driver;
use App\Models\Incident;
use App\Models\Message;
use App\Models\Operation;
use App\Models\SalesQuote;
use App\Models\User;
use App\Models\Vehicle;
use Database\Seeders\RoleSeeder;

trait CreatesTmsFixtures
{
    protected function seedRoles(): void
    {
        $this->seed(RoleSeeder::class);
    }

    protected function createUserWithRole(string $role, array $attributes = []): User
    {
        return User::factory()->create(array_merge(['role' => $role], $attributes));
    }

    protected function createClientAccount(array $userAttributes = [], array $clientAttributes = []): array
    {
        $user = $this->createUserWithRole('client', $userAttributes);

        $client = Client::create(array_merge([
            'company_name' => fake()->unique()->company(),
            'contact_name' => 'Contact Test',
            'contact_email' => $user->email,
            'address_line1' => '1 rue Test',
            'city' => 'Paris',
            'postal_code' => '75001',
            'country' => 'FR',
            'user_id' => $user->id,
        ], $clientAttributes));

        return [$user, $client];
    }

    protected function createDriverAccount(array $userAttributes = [], array $driverAttributes = []): array
    {
        $user = $this->createUserWithRole('driver', $userAttributes);

        $driver = Driver::create(array_merge([
            'user_id' => $user->id,
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'phone' => '0600000000',
            'email' => $user->email,
            'license_number' => fake()->unique()->bothify('DRV-####'),
            'license_type' => 'C+E',
            'status' => 'available',
        ], $driverAttributes));

        return [$user, $driver];
    }

    protected function createVehicle(array $attributes = []): Vehicle
    {
        return Vehicle::create(array_merge([
            'plate_number' => fake()->unique()->bothify('??-###-??'),
            'brand' => 'Volvo',
            'model' => 'FH',
            'vehicle_type' => 'truck_19t',
            'status' => 'available',
        ], $attributes));
    }

    protected function createOperation(Client $client, array $attributes = []): Operation
    {
        return Operation::create(array_merge([
            'reference' => fake()->unique()->bothify('OP-####'),
            'client_id' => $client->id,
            'type' => 'national',
            'status' => 'assigned',
        ], $attributes));
    }

    protected function createSalesQuote(Client $client, User $owner, array $attributes = []): SalesQuote
    {
        return SalesQuote::create(array_merge([
            'reference' => fake()->unique()->bothify('DEV-####'),
            'client_id' => $client->id,
            'commercial_owner' => $owner->id,
            'title' => 'Devis test',
            'subtotal' => 1000,
            'total' => 1200,
            'valid_until' => now()->addDays(14),
            'status' => 'sent',
        ], $attributes));
    }

    protected function createDocument(Operation $operation, User $uploader, array $attributes = []): Document
    {
        return Document::create(array_merge([
            'operation_id' => $operation->id,
            'type' => 'cmr',
            'name' => 'cmr.pdf',
            'file_url' => 'https://example.com/cmr.pdf',
            'file_path' => 'documents/' . $operation->id . '/cmr.pdf',
            'uploaded_by' => $uploader->id,
            'status' => 'pending',
        ], $attributes));
    }

    protected function createMessage(Operation $operation, User $sender, array $attributes = []): Message
    {
        return Message::create(array_merge([
            'operation_id' => $operation->id,
            'sender_id' => $sender->id,
            'content' => 'Message de test',
            'type' => 'message',
            'sent_at' => now(),
        ], $attributes));
    }

    protected function createIncident(Operation $operation, User $reporter, array $attributes = []): Incident
    {
        return Incident::create(array_merge([
            'operation_id' => $operation->id,
            'type' => 'delay',
            'severity' => 'medium',
            'title' => 'Retard test',
            'status' => 'open',
            'reported_by' => $reporter->id,
        ], $attributes));
    }
}
