<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MachineSeeder extends Seeder
{
    public function run()
    {
        DB::table('machine_agricoles')->insert([
            [
                'id_cooperative_user' => 1,
                'type_machine' => 'Tracteur',
                'marque' => 'John Deere',
                'modele' => 'X300',
                'numero_serie' => 'JD12345X',
                'etat' => 'Disponible',
                'caracteristiques' => 'Puissance 150CV, 4 roues motrices',
                'tarif_jour' => 15000,
                'tarif_semaine' => 90000,
                'tarif_mois' => 350000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_cooperative_user' => 1,
                'type_machine' => 'Moissonneuse-batteuse',
                'marque' => 'CLAAS',
                'modele' => 'LEXION 770',
                'numero_serie' => 'CL98765X',
                'etat' => 'Disponible',
                'caracteristiques' => 'Récolte de blé, 12 tonnes/h',
                'tarif_jour' => 25000,
                'tarif_semaine' => 150000,
                'tarif_mois' => 500000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Ajoute autant de machines que tu veux ici
        ]);
    }
}
