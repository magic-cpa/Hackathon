<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriqueEtatMachine extends Model
{
    use HasFactory;

    protected $table = 'historique_etat_machines';
    protected $primaryKey = 'id_hist';
    protected $fillable = [
        'id_machine',
        'ancien_etat',
        'nouvel_etat',
        'changed_at',
        'changed_by_user',
        'commentaire',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    /**
     * Get the machine associated with this history entry
     */
    public function machine()
    {
        return $this->belongsTo(MachineAgricole::class, 'id_machine');
    }

    /**
     * Get the user who changed the state
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'changed_by_user');
    }
}
