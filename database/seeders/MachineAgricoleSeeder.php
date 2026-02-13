<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;



namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MachineAgricole;
use App\Models\PhotoMachine;

class MachineAgricoleSeeder extends Seeder
{
    public function run(): void
    {
        // change this to a real cooperative user id that exists
        $cooperativeUserId = 1;

        $machines = [
            [
                'type_machine' => 'Tracteur',
                'marque' => 'John Deere',
                'modele' => '6100M',
                'numero_serie' => 'JD6100M-001',
                'etat' => 'Disponible',
                'caracteristiques' => '100 CV, diesel, cabine climatisée',
                'tarif_jour' => 15000,
                'tarif_semaine' => 90000,
                'tarif_mois' => 300000,
                'image' => 'product1.jpg',
            ],
            [
                'type_machine' => 'Moissonneuse-batteuse',
                'marque' => 'Claas',
                'modele' => 'Lexion 670',
                'numero_serie' => 'CL670-002',
                'etat' => 'Disponible',
                'caracteristiques' => 'Grande capacité, coupe 7m',
                'tarif_jour' => 40000,
                'tarif_semaine' => 250000,
                'tarif_mois' => 800000,
                'image' => 'product2.jpg',
            ],
            [
                'type_machine' => 'Pulvérisateur',
                'marque' => 'Amazone',
                'modele' => 'UX 5200',
                'numero_serie' => 'AM5200-003',
                'etat' => 'Maintenance',
                'caracteristiques' => 'Capacité 5200L, rampe 36m',
                'tarif_jour' => 12000,
                'tarif_semaine' => 70000,
                'tarif_mois' => 250000,
                'image' => 'product3.jpg',
            ],
            [
                'type_machine' => 'Semoir',
                'marque' => 'Väderstad',
                'modele' => 'Rapid 400C',
                'numero_serie' => 'VR400C-004',
                'etat' => 'Disponible',
                'caracteristiques' => 'Largeur 4m, haute précision',
                'tarif_jour' => 10000,
                'tarif_semaine' => 60000,
                'tarif_mois' => 200000,
                'image' => 'product4.jpg',
            ],
        ];

        foreach ($machines as $data) {

            $machine = MachineAgricole::create([
                'id_cooperative_user' => $cooperativeUserId,
                'type_machine' => $data['type_machine'],
                'marque' => $data['marque'],
                'modele' => $data['modele'],
                'numero_serie' => $data['numero_serie'],
                'etat' => $data['etat'],
                'caracteristiques' => $data['caracteristiques'],
                'tarif_jour' => $data['tarif_jour'],
                'tarif_semaine' => $data['tarif_semaine'],
                'tarif_mois' => $data['tarif_mois'],
            ]);

            PhotoMachine::create([
                'id_machine' => $machine->id_machine,
                'url' => 'machines/' . $data['image'],
            ]);
        }
    }
}
