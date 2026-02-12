<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlageCalendrier extends Model
{
    use HasFactory;

    protected $table = 'plage_calendriers';
    protected $primaryKey = 'id_plage';
    protected $fillable = [
        'id_machine',
        'date_debut',
        'date_fin',
        'etat_plage',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    /**
     * Get the machine associated with this calendar slot
     */
    public function machine()
    {
        return $this->belongsTo(MachineAgricole::class, 'id_machine');
    }
}
