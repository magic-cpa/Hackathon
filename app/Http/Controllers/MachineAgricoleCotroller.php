<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MachineAgricole;
use App\Models\Reservation;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MachineAgricoleCotroller extends Controller
{

    public function index()
    {
        $machines = MachineAgricole::with('photos')
            ->orderByDesc('id_machine')
            ->get()
            ->map(function ($m) {
                $firstPhoto = $m->photos->first();
                return [
                    'id_machine' => $m->id_machine,
                    'type_machine' => $m->type_machine,
                    'marque' => $m->marque,
                    'modele' => $m->modele,
                    'etat' => $m->etat,
                    'tarif_jour' => (string) $m->tarif_jour,
                    'tarif_semaine' => (string) $m->tarif_semaine,
                    'tarif_mois' => (string) $m->tarif_mois,
                    'image' => $firstPhoto ? asset('storage/' . $firstPhoto->url) : asset('storage/products/product1.jpg'),
                    'photos' => $m->photos->map(fn($p) => asset('storage/products/' . $p->url)),
                ];
            });

        return Inertia::render('Products/Index', [
            'machines' => $machines,
        ]);
    }

    public function show(MachineAgricole $machine)
    {
        $machine->load('photos');

        $firstPhoto = $machine->photos->first();

        $data = [
            'id_machine' => $machine->id_machine,
            'type_machine' => $machine->type_machine,
            'marque' => $machine->marque,
            'modele' => $machine->modele,
            'etat' => $machine->etat,
            'tarif_jour' => (string) $machine->tarif_jour,
            'tarif_semaine' => (string) $machine->tarif_semaine,
            'tarif_mois' => (string) $machine->tarif_mois,
            'image' => $firstPhoto
                ? asset('storage/' . $firstPhoto->url)
                : asset('storage/products/product1.jpg'),
            'photos' => $machine->photos
                ->map(fn($p) => asset('storage/' . $p->url))
                ->values(),
        ];

        return Inertia::render('Products/Preview', [
            'machine' => $data,
        ]);
    }

}
