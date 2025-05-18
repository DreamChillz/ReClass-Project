<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
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
}
