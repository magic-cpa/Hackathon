<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilCooperative extends Model
{
    use HasFactory;

    protected $table = 'profil_cooperatives';
    protected $primaryKey = 'id_user';
    protected $fillable = [
        'id_user',
        'raison_sociale',
        'telephone_standard',
        'fax',
        'site_web',
        'lien_google_maps',
        'adresse_ligne',
        'wilaya',
        'commune',
        'rib_code_banque',
        'rib_code_agence',
        'rib_numero_compte',
        'rib_cle',
        'rib_banque',
        'rib_agence',
        'rib_adresse_banque',
    ];

    /**
     * Get the user associated with this profile
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    /**
     * Get all contacts for this cooperative
     */
    public function contacts()
    {
        return $this->hasMany(ContactCooperative::class, 'id_user', 'id_user');
    }

    /**
     * Get all machines owned by this cooperative
     */
    public function machines()
    {
        return $this->hasMany(MachineAgricole::class, 'id_cooperative_user', 'id_user');
    }
}
