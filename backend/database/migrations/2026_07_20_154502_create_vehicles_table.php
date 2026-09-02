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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('plate_number')->unique();
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->integer('year')->nullable();
            $table->enum('vehicle_type', ['van', 'truck_12t', 'truck_19t', 'truck_44t', 'semi_trailer', 'refrigerated', 'tanker'])->default('truck_19t');
            $table->enum('flux_category', ['national', 'international', 'mixte'])->nullable();
            $table->enum('status', ['available', 'in_use', 'maintenance', 'out_of_service'])->default('available');
            $table->decimal('max_weight', 10, 2)->nullable();
            $table->decimal('max_volume', 10, 2)->nullable();
            $table->boolean('temperature_controlled')->default(false);
            $table->boolean('adr_certified')->default(false);
            $table->foreignId('current_driver_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->decimal('current_lat', 10, 7)->nullable();
            $table->decimal('current_lng', 10, 7)->nullable();
            $table->integer('mileage')->default(0);
            $table->integer('maintenance_interval_km')->default(30000);
            $table->integer('last_maintenance_km')->nullable();
            $table->date('last_maintenance_date')->nullable();
            $table->date('next_maintenance_date')->nullable();
            $table->date('technical_inspection_date')->nullable();
            $table->date('insurance_expiry')->nullable();
            $table->date('registration_expiry')->nullable();
            $table->decimal('fuel_consumption_avg', 5, 2)->nullable();
            $table->decimal('total_fuel_cost', 10, 2)->default(0);
            $table->decimal('total_maintenance_cost', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
