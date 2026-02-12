<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $table = 'reservations';
    protected $primaryKey = 'id_reservation';
    protected $fillable = [
        'id_machine',
        'id_agriculteur_user',
        'date_debut',
        'date_fin',
        'montant',
        'mode_paiement',
        'etat_reservation',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'montant' => 'decimal:2',
    ];

    /**
     * Get the machine being reserved
     */
    public function machine()
    {
        return $this->belongsTo(MachineAgricole::class, 'id_machine');
    }

    /**
     * Get the agriculteur making the reservation
     */
    public function agriculteur()
    {
        return $this->belongsTo(User::class, 'id_agriculteur_user');
    }
}
