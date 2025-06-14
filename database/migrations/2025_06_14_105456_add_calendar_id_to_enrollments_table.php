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
        Schema::table('enrollments', function (Blueprint $table) {
            $table->unsignedInteger('calendar_id')
                  ->after('subject_id');

            // Add the foreign key constraint
            $table->foreign('calendar_id')
                  ->references('calendar_id')
                  ->on('calendars')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropForeign(['calendar_id']);

            // Then drop the column
            $table->dropColumn('calendar_id');
        });
    }
};
