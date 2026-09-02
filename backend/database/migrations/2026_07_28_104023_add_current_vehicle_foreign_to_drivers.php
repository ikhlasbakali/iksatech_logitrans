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
    Schema::table('drivers', function (Blueprint $table) {
        $table->foreign('current_vehicle_id')->references('id')->on('vehicles')->nullOnDelete();
    });
}

public function down(): void
{
    Schema::table('drivers', function (Blueprint $table) {
        $table->dropForeign(['current_vehicle_id']);
    });
}
};
