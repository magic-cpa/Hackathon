<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MachineAgricole;
use App\Models\PhotoMachine;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
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


    public function api()
    {
        $machines = MachineAgricole::with(['photos' => function ($q) {
            $q->orderBy('id_photo'); // first photo becomes main
        }])
            ->orderByDesc('id_machine')
            ->limit(7)
            ->get()
            ->map(function ($m) {
                $firstPhoto = $m->photos->first();

                return [
                    'id_machine' => $m->id_machine,
                    'type_machine' => $m->type_machine,
                    'marque' => $m->marque,
                    'modele' => $m->modele,
                    'numero_serie' => $m->numero_serie,
                    'etat' => $m->etat,
                    'statut' => $m->statut,
                    'tarif_jour' => (string) $m->tarif_jour,
                    'tarif_semaine' => (string) $m->tarif_semaine,
                    'tarif_mois' => (string) $m->tarif_mois,
                    'image' => $firstPhoto
                        ? asset('storage/' . $firstPhoto->url)
                        : asset('storage/products/product1.jpg'),
                    'photos' => $m->photos->map(fn($p) => [
                        'id_photo' => $p->id_photo,
                        'url' => asset('storage/' . $p->url),
                    ])->values(),
                    'created_at' => optional($m->created_at)->toISOString(),
                ];
            });

        return response()->json($machines);
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

    public function table(Request $request)
    {
        $user = $request->user();
        if (!$user->hasRole('cooperative')) {
            abort(403);
        }

        $machines = MachineAgricole::with('photos')
            ->where('id_cooperative_user', $user->id)
            ->orderByDesc('id_machine')
            ->get();

        return Inertia::render('Products/Table', [
            'machines' => $machines
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Unauthorized');
        }

        if (!$user->hasRole('cooperative')) {
            return redirect()->back()->with('error', 'Only cooperatives can add machines');
        }

        $validated = $request->validate([
            'type_machine' => ['required', 'string', 'max:100'],
            'marque' => ['required', 'string', 'max:100'],
            'modele' => ['required', 'string', 'max:100'],
            'numero_serie' => ['required', 'string', 'unique:machine_agricoles,numero_serie'],
            'etat' => ['required', 'in:bon,moyen,mauvais'],
            'statut' => ['required', 'in:disponible,occupe,maintenance,hors_service'],
            'caracteristiques' => ['nullable', 'string'],
            'tarif_jour' => ['nullable', 'numeric', 'min:0'],
            'tarif_semaine' => ['nullable', 'numeric', 'min:0'],
            'tarif_mois' => ['nullable', 'numeric', 'min:0'],

            'photos' => ['required', 'array', 'min:1', 'max:5'],
            'photos.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $machine = MachineAgricole::create([
            'id_cooperative_user' => $user->id,
            'type_machine' => $validated['type_machine'],
            'marque' => $validated['marque'],
            'modele' => $validated['modele'],
            'numero_serie' => $validated['numero_serie'],
            'etat' => $validated['etat'],
            'statut' => $validated['statut'],
            'caracteristiques' => $validated['caracteristiques'] ?? null,
            'tarif_jour' => $validated['tarif_jour'] ?? 0,
            'tarif_semaine' => $validated['tarif_semaine'] ?? 0,
            'tarif_mois' => $validated['tarif_mois'] ?? 0,
        ]);

        $files = $request->file('photos', []);
        $saved = [];

        foreach ($files as $i => $file) {
            $name = now()->format('YmdHis') . '_' . $i . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs("products/{$machine->id_machine}", $name, 'public');

            $saved[] = PhotoMachine::create([
                'id_machine' => $machine->id_machine,
                'url' => $path,
            ]);
        }

        return redirect()
            ->route('products.table')
            ->with('success', 'Machine added successfully');
    }

    public function edit(MachineAgricole $product, Request $request)
    {
        if ($product->id_cooperative_user !== $request->user()->id && !$request->user()->hasRole('admin')) {
            abort(403);
        }

        return Inertia::render('Products/Update', [
            'machine' => [
                ...$product->toArray(),
                'photos' => $product->photos->map(fn($p) => [
                    'id_photo' => $p->id_photo,
                    'url' => asset('storage/' . $p->url),
                ])->values(),
            ],
        ]);
    }

    public function update(Request $request, MachineAgricole $machine)
    {
        $user = $request->user();

        if ($machine->id_cooperative_user !== $user->id && !$user->hasRole('admin')) {
            abort(403);
        }

        $validated = $request->validate([
            'type_machine' => ['required', 'string', 'max:100'],
            'marque' => ['required', 'string', 'max:100'],
            'modele' => ['required', 'string', 'max:100'],
            'numero_serie' => ['required', 'string', 'unique:machine_agricoles,numero_serie,' . $machine->id_machine . ',id_machine'],
            'etat' => ['required', 'in:bon,moyen,mauvais'],
            'statut' => ['required', 'in:disponible,occupe,maintenance,hors_service'],
            'caracteristiques' => ['nullable', 'string'],
            'tarif_jour' => ['nullable', 'numeric', 'min:0'],
            'tarif_semaine' => ['nullable', 'numeric', 'min:0'],
            'tarif_mois' => ['nullable', 'numeric', 'min:0'],
            'photos' => ['nullable', 'array', 'max:5'],
            'photos.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_photo_ids' => ['nullable', 'array'],
            'remove_photo_ids.*' => ['integer', 'exists:photo_machines,id_photo'],
        ]);

        $machine->update([
            'type_machine' => $validated['type_machine'],
            'marque' => $validated['marque'],
            'modele' => $validated['modele'],
            'numero_serie' => $validated['numero_serie'],
            'etat' => $validated['etat'],
            'statut' => $validated['statut'],
            'caracteristiques' => $validated['caracteristiques'] ?? null,
            'tarif_jour' => $validated['tarif_jour'] ?? 0,
            'tarif_semaine' => $validated['tarif_semaine'] ?? 0,
            'tarif_mois' => $validated['tarif_mois'] ?? 0,
        ]);

        $removeIds = $validated['remove_photo_ids'] ?? [];

        if (count($removeIds)) {
            $photosToDelete = PhotoMachine::where('id_machine', $machine->id_machine)
                ->whereIn('id_photo', $removeIds)
                ->get();

            foreach ($photosToDelete as $p) {
                Storage::disk('public')->delete($p->url);
                $p->delete();
            }
        }

        $existingCount = PhotoMachine::where('id_machine', $machine->id_machine)->count();
        $incoming = $request->file('photos', []);
        $incomingCount = is_array($incoming) ? count($incoming) : 0;

        if ($incomingCount > 0) {
            $maxAllowed = 5 - $existingCount;

            if ($maxAllowed <= 0) return back()->with('error', 'Maximum 5 images already reached');
            if ($incomingCount > $maxAllowed) return back()->with('error', "You can add only {$maxAllowed} more image(s)");

            foreach ($incoming as $i => $file) {
                $name = now()->format('YmdHis') . '_' . $i . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs("products/{$machine->id_machine}", $name, 'public');

                PhotoMachine::create([
                    'id_machine' => $machine->id_machine,
                    'url' => $path,
                ]);
            }
        }

        return redirect()->route('products.table')->with('success', 'Machine updated successfully');
    }

    public function destroy(MachineAgricole $product, Request $request)
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Unauthorized');
        }

        if ($product->id_cooperative_user !== $user->id && !$user->hasRole('admin')) {
            abort(403, 'You can only delete your own machines');
        }

        // Delete associated photos
        $product->photos()->delete();

        // Delete the machine
        $product->delete();

        return redirect()
            ->route('products.table')
            ->with('success', 'Machine deleted successfully');
    }
}
