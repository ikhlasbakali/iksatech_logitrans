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
        Schema::create('customs_checkpoints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('operation_id')->constrained('operations')->cascadeOnDelete();
            $table->string('checkpoint_kind');
            $table->string('label');
            $table->string('address');
            $table->string('country_code');
            $table->string('customs_reference')->nullable();
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->integer('sequence_order');
            $table->dateTime('scheduled_window_start')->nullable();
            $table->dateTime('scheduled_window_end')->nullable();
            $table->string('status')->default('pending');
            $table->integer('radius_meters')->nullable();
            $table->dateTime('arrived_at')->nullable();
            $table->string('arrived_by_name')->nullable();
            $table->decimal('arrived_lat', 10, 7)->nullable();
            $table->decimal('arrived_lng', 10, 7)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customs_checkpoints');
    }
};
