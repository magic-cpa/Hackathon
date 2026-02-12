<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilAgriculteur extends Model
{
    use HasFactory;

    protected $table = 'profil_agriculteurs';
    protected $primaryKey = 'id_user';
    protected $fillable = [
        'id_user',
        'identifiant',
        'raison_sociale',
        'telephone_exploitation',
        'fax',
        'site_web',
        'lien_google_maps',
        'adresse_ligne',
        'wilaya',
        'commune',
    ];

    /**
     * Get the user associated with this profile
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    /**
     * Get all contacts for this agriculteur
     */
    public function contacts()
    {
        return $this->hasMany(ContactAgriculteur::class, 'id_user', 'id_user');
    }

    /**
     * Get all reservations made by this agriculteur
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_agriculteur_user', 'id_user');
    }
}
