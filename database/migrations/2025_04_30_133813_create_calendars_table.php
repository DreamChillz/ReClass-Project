<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration for the CALENDARS table (weekly base class slots)
class CreateCalendarsTable extends Migration
{
    public function up()
    {
        Schema::create('calendars', function (Blueprint $table) {
            $table->increments('calendar_id');
            $table->string('day', 3);
            $table->time('time');
            $table->string('center_id', 20);
            $table->timestamps();

            $table->foreign('center_id')
                ->references('center_id')
                ->on('centers')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('calendars');
    }
}



