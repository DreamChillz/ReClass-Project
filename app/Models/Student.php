<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $primaryKey = 'student_id';

    // 2) Since student_id is a varchar (not an auto-incrementing integer):
    public $incrementing = false;
    protected $keyType = 'string';
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
