<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotoMachine extends Model
{
    use HasFactory;

    protected $table = 'photo_machines';
    protected $primaryKey = 'id_photo';
    protected $fillable = [
        'id_machine',
        'url',
    ];

    /**
     * Get the machine associated with this photo
     */
    public function machine()
    {
        return $this->belongsTo(MachineAgricole::class, 'id_machine');
    }
}
