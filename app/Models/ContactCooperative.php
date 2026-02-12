<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactCooperative extends Model
{
    use HasFactory;

    protected $table = 'contact_cooperatives';
    protected $primaryKey = 'id_contact';
    protected $fillable = [
        'id_user',
        'nom',
        'prenom',
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
     * Get the cooperative profile
     */
    public function profilCooperative()
    {
        return $this->belongsTo(ProfilCooperative::class, 'id_user', 'id_user');
    }
}
