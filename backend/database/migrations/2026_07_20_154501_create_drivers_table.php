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
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('license_number')->unique();
            $table->string('license_type');
            $table->enum('status', ['available', 'on_mission', 'off_duty', 'on_break', 'inactive'])->default('available');
            $table->string('current_position')->nullable();
            $table->decimal('current_lat', 10, 7)->nullable();
            $table->decimal('current_lng', 10, 7)->nullable();
            $table->foreignId('current_vehicle_id')->nullable();
            $table->date('visa_expiry_date')->nullable();
            $table->decimal('rating', 3, 2)->nullable();
            $table->integer('total_deliveries')->default(0);
            $table->decimal('on_time_rate', 5, 2)->default(100);
            $table->json('certifications')->nullable();
            $table->string('photo_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
