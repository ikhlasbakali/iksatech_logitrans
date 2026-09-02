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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('operation_id')->nullable()->constrained('operations')->nullOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->string('sender_role_label')->nullable();
            $table->foreignId('receiver_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('content');
            $table->enum('type', ['message', 'status_update', 'alert', 'system'])->default('message');
            $table->json('attachments')->nullable();
            $table->boolean('is_read')->default(false);
            $table->dateTime('sent_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
