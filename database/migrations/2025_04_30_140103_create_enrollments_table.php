<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


// Migration for the ENROLLMENTS table (student ↔ subject)
return new class extends Migration
{
    public function up()
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->increments('enrollment_id');
            $table->string('student_id', 20);
            $table->unsignedInteger('subject_id');
            $table->timestamps();

            $table->foreign('student_id')
                ->references('student_id')
                ->on('students')
                ->onDelete('cascade');

            $table->foreign('subject_id')
                ->references('subject_id')
                ->on('subjects')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('enrollments');
    }
};
