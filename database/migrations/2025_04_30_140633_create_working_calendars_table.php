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
        Schema::create('working_calendars', function (Blueprint $table) {
            $table->increments('working_calendar_id');
            $table->unsignedInteger('calendar_id');
            $table->date('date');
            $table->timestamps();

            $table->foreign('calendar_id')
                ->references('calendar_id')
                ->on('calendars')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('working_calendars');
    }
};
