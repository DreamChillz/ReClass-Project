<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'student_id',
        'student_name',
        'gender',
        'email',
        'enrolled_date',
        'status',
        'contact_number',
        'date_of_birth',
        'center_id',
        'parent_name'
    ];

    protected $casts = [
        'date_of_birth'  => 'date',
        'enrolled_date'  => 'date',
    ];
}
