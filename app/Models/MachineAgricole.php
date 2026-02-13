<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MachineAgricole extends Model
{
    use HasFactory;

    protected $table = 'machine_agricoles';
    protected $primaryKey = 'id_machine';
    protected $fillable = [
        'id_cooperative_user',
        'type_machine',
        'marque',
        'modele',
        'numero_serie',
        'etat',
        'statut',
        'caracteristiques',
        'tarif_jour',
        'tarif_semaine',
        'tarif_mois',
    ];

    protected $casts = [
        'tarif_jour' => 'decimal:2',
        'tarif_semaine' => 'decimal:2',
        'tarif_mois' => 'decimal:2',
    ];

    /**
     * Get the cooperative user who owns this machine
     */
    public function cooperative()
    {
        return $this->belongsTo(User::class, 'id_cooperative_user');
    }

    /**
     * Get all photos for this machine
     */
    public function photos()
    {
        return $this->hasMany(PhotoMachine::class, 'id_machine');
    }

    /**
     * Get all calendar slots for this machine
     */
    public function plagesCalendrier()
    {
        return $this->hasMany(PlageCalendrier::class, 'id_machine');
    }

    /**
     * Get all reservations for this machine
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_machine');
    }

    /**
     * Get all state history entries for this machine
     */
    public function historiqueEtat()
    {
        return $this->hasMany(HistoriqueEtatMachine::class, 'id_machine');
    }
}
