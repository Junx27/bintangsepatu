<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CatatanStok extends Model
{
    use HasFactory;
    protected $fillable = [
        'catatan',
        'status',
        'user_id',
        'bahan_baku_id',
    ];
}
