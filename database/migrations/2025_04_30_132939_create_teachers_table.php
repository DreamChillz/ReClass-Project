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
        Schema::create('teachers', function (Blueprint $table) {
            // Primary key
            $table->increments('teacher_id');

            // Basic info
            $table->string('teacher_name', 100);
            $table->enum('gender', ['male', 'female']);
            $table->string('email', 50);
            $table->date('date_joined');
            $table->enum('status', ['active', 'dropped']);
            $table->string('contact_number', 20);

            // Foreign key to centers (assuming centers.center_id is VARCHAR(20))
            $table->string('center_id', 20);
            $table->foreign('center_id')
                ->references('center_id')
                ->on('centers')
                ->onDelete('cascade');

            // Capacity
            $table->unsignedTinyInteger('max_capacity');

            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
