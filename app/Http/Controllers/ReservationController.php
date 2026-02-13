<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index() {}


    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Unauthorized');
        }

        if (!$user->hasRole('agriculteur')) {
            abort(403, 'Only agriculteurs can reserve machines');
        }

        $data = $request->validate([
            'id_machine' => ['required', 'integer', 'exists:machine_agricoles,id_machine'],
            'date_debut' => ['required', 'date'],
            'date_fin' => ['required', 'date', 'after_or_equal:date_debut'],
            'note' => ['nullable', 'string', 'max:500'],
            'montant' => ['nullable', 'numeric'],
            'etat_reservation' => ['nullable', 'string', 'max:50'],
        ]);

        Reservation::create([
            'id_machine' => $data['id_machine'],
            'id_agriculteur_user' => $user->id,
            'date_debut' => $data['date_debut'],
            'date_fin' => $data['date_fin'],
            'montant' => $data['montant'] ?? 0,
            'mode_paiement' => 'cash',
            'etat_reservation' => 'En attente',
        ]);

        return redirect()
            ->route('products.index')
            ->with('success', 'Reservation created');
    }
}
