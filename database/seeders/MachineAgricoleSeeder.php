<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MachineAgricole;
use App\Models\PhotoMachine;
use App\Models\User;
use Illuminate\Support\Facades\File;

class MachineAgricoleSeeder extends Seeder
{
    public function run(): void
    {
        // Mapping des types de machines avec leurs informations
        $machineTypes = [
            1 => [
                'type_name' => 'Tracteur',
                'marques' => ['John Deere', 'Case IH', 'Massey Ferguson'],
                'modeles' => ['8R', '6140', 'MF7726'],
                'etat' => 'disponible',
            ],
            2 => [
                'type_name' => 'Charrue',
                'marques' => ['Kuhn', 'Lemken', 'Kverneland'],
                'modeles' => ['Master', 'Juwel', 'Vario'],
                'etat' => 'disponible',
            ],
            3 => [
                'type_name' => 'Herse',
                'marques' => ['Horsch', 'Amazone', 'Väderstad'],
                'modeles' => ['Compact', 'Cenius', 'Carrier'],
                'etat' => 'disponible',
            ],
            4 => [
                'type_name' => 'Ensileuse',
                'marques' => ['Claas', 'Fendt', 'Krone'],
                'modeles' => ['Jaguar', 'Ideal', 'BiG X'],
                'etat' => 'disponible',
            ],
            5 => [
                'type_name' => 'Moissonneuse',
                'marques' => ['Claas', 'John Deere', 'Fendt'],
                'modeles' => ['Lexion', 'T670', 'Ideal'],
                'etat' => 'disponible',
            ],
            6 => [
                'type_name' => 'Épandeur',
                'marques' => ['Pottinger', 'Bergmann', 'Kverneland'],
                'modeles' => ['Jumbo', 'Air', 'Axis'],
                'etat' => 'disponible',
            ],
            7 => [
                'type_name' => 'Pulvérisateur',
                'marques' => ['Amazone', 'Hardi', 'Tecnoma'],
                'modeles' => ['UX', 'Rubicon', 'Tecnis'],
                'etat' => 'disponible',
            ],
            8 => [
                'type_name' => 'Semoir',
                'marques' => ['Kuhn', 'Amazone', 'Väderstad'],
                'modeles' => ['Planter', 'Cirrus', 'Tempo'],
                'etat' => 'disponible',
            ],
            9 => [
                'type_name' => 'Télescopique',
                'marques' => ['JCB', 'Bobcat', 'Caterpillar'],
                'modeles' => ['Loadall', 'T870', 'TL1055'],
                'etat' => 'disponible',
            ],
            10 => [
                'type_name' => 'Faucheuse',
                'marques' => ['Claas', 'Krone', 'Kuhn'],
                'modeles' => ['Disco', 'EasyCut', 'GMT'],
                'etat' => 'disponible',
            ],
            11 => [
                'type_name' => 'Presse à fourrage',
                'marques' => ['Claas', 'New Holland', 'John Deere'],
                'modeles' => ['Quadrant', 'Square Baler', 'L340'],
                'etat' => 'disponible',
            ],
        ];

        // Créer les machines agricoles and attach photos from public/storage/products/typeX/machine_Y
        foreach ($machineTypes as $typeNumber => $typeInfo) {
            // Créer 4 machines pour chaque type
            for ($machineNumber = 1; $machineNumber <= 4; $machineNumber++) {
                // Obtenez un utilisateur aléatoire
                $users = User::all();
                if ($users->isEmpty()) {
                    $this->command->warn("Aucun utilisateur trouvé. Veuillez créer des utilisateurs d'abord.");
                    continue;
                }

                $user = $users->random();

                // Créer la machine agricole
                $machine = MachineAgricole::create([
                    'id_cooperative_user' => $user->id,
                    'type_machine' => $typeInfo['type_name'],
                    'marque' => $typeInfo['marques'][($machineNumber - 1) % count($typeInfo['marques'])],
                    'modele' => $typeInfo['modeles'][($machineNumber - 1) % count($typeInfo['modeles'])],
                    'numero_serie' => strtoupper('SN' . str_pad($typeNumber, 2, '0', STR_PAD_LEFT) . str_pad($machineNumber, 2, '0', STR_PAD_LEFT) . date('YmdHis')),
                    'etat' => $typeInfo['etat'],
                    'caracteristiques' => "Machine agricole de type {$typeInfo['type_name']} en bon état",
                    'tarif_jour' => rand(50, 200),
                    'tarif_semaine' => rand(300, 1000),
                    'tarif_mois' => rand(1000, 3000),
                ]);

                // Ajouter les photos depuis public/storage/products/type{typeNumber}/machine_{machineNumber}
                $this->addMachinePhotosFromPublic($machine, $typeNumber, $machineNumber);
            }
        }

        $this->command->info('Machines agricoles et photos créées avec succès');
    }

    /**
     * Ajouter les photos d'une machine à partir du dossier correspondant
     */
    private function addMachinePhotos(MachineAgricole $machine, array $filenames): void
    {
        foreach ($filenames as $filename) {
            PhotoMachine::create([
                'id_machine' => $machine->id_machine,
                'url' => "products/{$filename}",
            ]);
        }
    }

    /**
     * Read images from public/storage/products/type{typeNumber}/machine_{machineNumber}
     * and attach them to the given machine.
     */
    private function addMachinePhotosFromPublic(MachineAgricole $machine, int $typeNumber, int $machineNumber): void
    {
        $dir = public_path("storage/products/type{$typeNumber}/machine_{$machineNumber}");
        if (!File::isDirectory($dir)) {
            return;
        }

        $files = File::files($dir);
        $filenames = [];
        foreach ($files as $f) {
            $name = $f->getFilename();
            $filenames[] = "type{$typeNumber}/machine_{$machineNumber}/{$name}";
        }

        if (!empty($filenames)) {
            $this->addMachinePhotos($machine, $filenames);
        }
    }

    /**
     * Distribute photos found in public/storage/products to the given machines
     * - Matches files containing the type name (case-insensitive).
     * - If filename contains pattern F<number> (e.g. TracteurF2.jpg) assigns to that machine index.
     * - Otherwise distributes remaining files round-robin across machines.
     */
    private function distributePhotosForType(int $typeNumber, array $typeInfo, array $machines): void
    {
        if (empty($machines)) {
            return;
        }

        $publicProductsPath = public_path('storage/products');
        if (!File::isDirectory($publicProductsPath)) {
            return;
        }

        $allFiles = File::files($publicProductsPath);
        $matched = [];
        $round = [];

        $typeLabel = $typeInfo['type_name'];

        foreach ($allFiles as $file) {
            $basename = $file->getFilename();
            if (stripos($basename, $typeLabel) === false) {
                continue;
            }

            // Try to detect F<number> in filename (strict: digits after F, followed by non-digit or end)
            if (preg_match('/F(\d+)(?=\D|$)/i', $basename, $m)) {
                $idx = intval($m[1]);
                if ($idx >= 1 && $idx <= count($machines)) {
                    $matched[$idx][] = $basename;
                    continue;
                }
            }

            // No explicit index found -> queue for round-robin
            $round[] = $basename;
        }

        // Assign explicit matches
        foreach ($matched as $idx => $files) {
            $machine = $machines[$idx - 1];
            $this->addMachinePhotos($machine, $files);
        }

        // Distribute round-robin
        $i = 0;
        $machineCount = count($machines);
        foreach ($round as $file) {
            $machine = $machines[$i % $machineCount];
            $this->addMachinePhotos($machine, [$file]);
            $i++;
        }
    }
}
