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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->unique();
            $table->string('external_code')->nullable();
            $table->string('legal_id')->nullable();
            $table->string('sector')->nullable();
            $table->string('contact_name');
            $table->string('contact_email');
            $table->string('phone_number')->nullable();
            $table->string('address_line1');
            $table->string('city');
            $table->string('postal_code');
            $table->string('country');
            $table->string('payment_terms')->nullable();
            $table->string('type')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
