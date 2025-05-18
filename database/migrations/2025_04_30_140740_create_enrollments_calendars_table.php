<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('enrollments_calendars', function (Blueprint $table) {
            $table->increments('enrollment_calendar_id');
            $table->unsignedInteger('enrollment_id');
            $table->unsignedInteger('working_calendar_id');
            $table->unsignedInteger('teacher_session_id');
            $table->unsignedInteger('replaced_enrollment_id')->nullable();
            $table->string('attendance_status', 20)->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('enrollment_id')
                ->references('enrollment_id')
                ->on('enrollments')
                ->onDelete('cascade');

            $table->foreign('working_calendar_id')
                ->references('working_calendar_id')
                ->on('working_calendars')
                ->onDelete('cascade');

            $table->foreign('teacher_session_id')
                ->references('teacher_session_id')
                ->on('teacher_sessions')
                ->onDelete('cascade');

            $table->foreign('replaced_enrollment_id')
                ->references('enrollment_calendar_id')
                ->on('enrollments_calendars')
                ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('enrollments_calendars');
    }
};
