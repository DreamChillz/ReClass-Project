<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $primaryKey = 'subject_id';
    
    protected $fillable = [
        'subject_name',
        'tuition_type',
        'fees',
    ];

    protected $casts = [
        'fees' => 'decimal:2',
    ];
}
