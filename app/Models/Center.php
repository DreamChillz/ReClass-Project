<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Center extends Model
{
    protected $fillable = [
        'center_id',
        'center_name',
        'center_address',
    ];
}
