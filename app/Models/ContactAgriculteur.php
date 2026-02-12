<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactAgriculteur extends Model
{
    use HasFactory;

    protected $table = 'contact_agriculteurs';
    protected $primaryKey = 'id_contact';
    protected $fillable = [
        'id_user',
        'nom',
        'prenom',
        'telephone_fixe',
        'numero_poste',
        'telephone_mobile',
        'fax',
        'email_contact',
    ];

    /**
     * Get the user associated with this contact
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    /**
     * Get the agriculteur profile
     */
    public function profilAgriculteur()
    {
        return $this->belongsTo(ProfilAgriculteur::class, 'id_user', 'id_user');
    }
}
