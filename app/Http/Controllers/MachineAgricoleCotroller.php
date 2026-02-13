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

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Unauthorized');
        }

        if (!$user->hasRole('cooperative')) {
            return redirect()
                ->back()
                ->with('error', 'Only cooperatives can add machines');
        }

        $validated = $request->validate([
            'type_machine' => ['required', 'string', 'max:100'],
            'marque' => ['required', 'string', 'max:100'],
            'modele' => ['required', 'string', 'max:100'],
            'numero_serie' => ['required', 'string', 'unique:machine_agricoles,numero_serie'],
            'etat' => ['required', 'string', 'max:50'],
            'statut' => ['nullable', 'in:disponible,occupe,maintenance,hors_service'],
            'caracteristiques' => ['nullable', 'string'],
            'tarif_jour' => ['nullable', 'numeric', 'min:0'],
            'tarif_semaine' => ['nullable', 'numeric', 'min:0'],
            'tarif_mois' => ['nullable', 'numeric', 'min:0'],
        ]);

        $machine = MachineAgricole::create([
            'id_cooperative_user' => $user->id,
            'type_machine' => $validated['type_machine'],
            'marque' => $validated['marque'],
            'modele' => $validated['modele'],
            'numero_serie' => $validated['numero_serie'],
            'etat' => $validated['etat'],
            'statut' => $validated['statut'] ?? 'disponible',
            'caracteristiques' => $validated['caracteristiques'] ?? null,
            'tarif_jour' => $validated['tarif_jour'] ?? 0,
            'tarif_semaine' => $validated['tarif_semaine'] ?? 0,
            'tarif_mois' => $validated['tarif_mois'] ?? 0,
        ]);

        return redirect()
            ->route('products.index')
            ->with('success', 'Machine added successfully');
    }

    public function destroy(MachineAgricole $machine, Request $request)
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Unauthorized');
        }

        if ($machine->id_cooperative_user !== $user->id && !$user->hasRole('admin')) {
            abort(403, 'You can only delete your own machines');
        }

        // Delete associated photos
        $machine->photos()->delete();

        // Delete the machine
        $machine->delete();

        return redirect()
            ->route('products.index')
            ->with('success', 'Machine deleted successfully');
    }
}
