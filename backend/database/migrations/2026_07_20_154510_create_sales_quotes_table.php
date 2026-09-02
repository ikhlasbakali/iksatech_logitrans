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
        Schema::create('sales_quotes', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->foreignId('commercial_owner')->constrained('users');
            $table->string('contact_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('title');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('vat_rate', 4, 2)->default(20.00);
            $table->decimal('discount_amount', 10, 2)->default(0.00);
            $table->decimal('total', 10, 2);
            $table->string('currency')->default('EUR');
            $table->json('quote_lines')->nullable();
            $table->dateTime('valid_until');
            $table->enum('status', ['draft', 'sent', 'accepted', 'rejected', 'expired', 'invoiced'])->default('draft');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_quotes');
    }
};
