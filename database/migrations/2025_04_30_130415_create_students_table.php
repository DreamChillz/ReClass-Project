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
        Schema::create('students', function (Blueprint $table) {
            $table->string('student_id', 20)->primary();
            $table->string('student_name', 100);
            $table->enum('gender', ['male', 'female']);
            $table->string('email', 50);
            $table->date('enrolled_date');
            $table->enum('status', ['study', 'dropped']);
            $table->string('contact_number', 20);
            $table->date('date_of_birth');
            $table->string('center_id', 20);
            $table->string('parent_name', 100);
            $table->timestamps();

            // Foreign key to centers.center_id
            $table->foreign('center_id')
                ->references('center_id')
                ->on('centers')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
