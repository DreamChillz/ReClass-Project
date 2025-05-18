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
        Schema::create('teacher_sessions', function (Blueprint $table) {
            $table->increments('teacher_session_id');
            $table->unsignedInteger('teacher_id');
            $table->unsignedInteger('working_calendar_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('teacher_id')
                ->references('teacher_id')
                ->on('teachers')
                ->onDelete('cascade');

            $table->foreign('working_calendar_id')
                ->references('working_calendar_id')
                ->on('working_calendars')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('teacher_sessions');
    }
};
