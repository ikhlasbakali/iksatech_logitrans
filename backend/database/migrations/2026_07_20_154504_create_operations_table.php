<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('operations', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('client_id')->constrained('clients');
            $table->enum('type', ['import', 'export', 'national', 'international', 'groupage', 'lot_complet']);
            $table->enum('status', ['draft', 'confirmed', 'assigned', 'loading', 'in_transit', 'unloading', 'delivered', 'completed', 'cancelled', 'incident'])->default('draft');
            $table->enum('previous_status', ['draft', 'confirmed', 'assigned', 'loading', 'in_transit', 'unloading', 'delivered', 'completed', 'cancelled', 'incident'])->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->string('incoterm')->nullable();
            $table->string('pickup_address')->nullable();
            $table->string('pickup_city')->nullable();
            $table->string('pickup_country')->nullable();
            $table->decimal('pickup_lat', 10, 7)->nullable();
            $table->decimal('pickup_lng', 10, 7)->nullable();
            $table->string('delivery_address')->nullable();
            $table->string('delivery_city')->nullable();
            $table->string('delivery_country')->nullable();
            $table->decimal('delivery_lat', 10, 7)->nullable();
            $table->decimal('delivery_lng', 10, 7)->nullable();
            $table->dateTime('scheduled_pickup')->nullable();
            $table->dateTime('scheduled_delivery')->nullable();
            $table->dateTime('actual_pickup')->nullable();
            $table->dateTime('actual_delivery')->nullable();
            $table->dateTime('eta')->nullable();
            $table->foreignId('driver_1_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->foreignId('driver_2_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->text('cargo_description')->nullable();
            $table->decimal('cargo_weight', 10, 2)->nullable();
            $table->decimal('cargo_volume', 10, 2)->nullable();
            $table->integer('cargo_pallets')->nullable();
            $table->boolean('temperature_controlled')->default(false);
            $table->boolean('is_adr')->default(false);
            $table->text('special_instructions')->nullable();
            $table->decimal('current_lat', 10, 7)->nullable();
            $table->decimal('current_lng', 10, 7)->nullable();
            $table->integer('delay_minutes')->default(0);
            $table->integer('ai_risk_score')->nullable();
            $table->text('ai_summary')->nullable();
            $table->foreignId('assigned_agent')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operations');
    }
};
