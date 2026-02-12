<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ============ Relationships ============

    /**
     * Get the cooperative profile for this user
     */
    public function profilCooperative()
    {
        return $this->hasOne(ProfilCooperative::class, 'id_user');
    }

    /**
     * Get the agriculteur profile for this user
     */
    public function profilAgriculteur()
    {
        return $this->hasOne(ProfilAgriculteur::class, 'id_user');
    }

    /**
     * Get all contacts for this cooperative user
     */
    public function contactsCooperative()
    {
        return $this->hasMany(ContactCooperative::class, 'id_user');
    }

    /**
     * Get all contacts for this agriculteur user
     */
    public function contactsAgriculteur()
    {
        return $this->hasMany(ContactAgriculteur::class, 'id_user');
    }

    /**
     * Get all machines owned by this cooperative user
     */
    public function machines()
    {
        return $this->hasMany(MachineAgricole::class, 'id_cooperative_user');
    }

    /**
     * Get all reservations made by this agriculteur user
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'id_agriculteur_user');
    }

    /**
     * Get all machine state history entries created by this user
     */
    public function historiqueEtatMachines()
    {
        return $this->hasMany(HistoriqueEtatMachine::class, 'changed_by_user');
    }
}
