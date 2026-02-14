<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationRequestMail;
use App\Mail\ReservationReceiptMail;
use Inertia\Inertia;

class ReservationController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->hasRole('cooperative')) {
            abort(403);
        }

        // Get reservations for machines owned by this cooperative
        $reservations = Reservation::with(['machine', 'agriculteur'])
            ->whereHas('machine', function ($query) use ($user) {
                $query->where('id_cooperative_user', $user->id);
            })
            ->orderByDesc('id_reservation')
            ->get();

        // dd($reservations,$user);

        return Inertia::render('Reservation/Table', [
            'reservations' => $reservations
        ]);
    }


    public function update(Request $request, Reservation $reservation)
    {
        $user = $request->user();

        // Check if the machine belongs to the cooperative
        $reservation->load('machine');
        if ($reservation->machine->id_cooperative_user !== $user->id && !$user->hasRole('admin')) {
            abort(403);
        }

        $validated = $request->validate([
            'etat_reservation' => ['required', 'string', 'in:Validé,Refusé,Terminé'],
        ]);

        $reservation->update($validated);

        return redirect()->back()->with('success', 'Statut de réservation mis à jour.');
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Unauthorized');
        }

        if (!$user->hasRole('agriculteur')) {
            return redirect()
                ->back()
                ->with('error', 'Only agriculteurs can reserve machines');
        }

        $data = $request->validate([
            'id_machine' => ['required', 'integer', 'exists:machine_agricoles,id_machine'],
            'date_debut' => ['required', 'date'],
            'date_fin' => ['required', 'date', 'after_or_equal:date_debut'],
            'note' => ['nullable', 'string', 'max:500'],
            'montant' => ['nullable', 'numeric'],
            'etat_reservation' => ['nullable', 'string', 'max:50'],
        ]);

        $reservation = Reservation::create([
            'id_machine' => $data['id_machine'],
            'id_agriculteur_user' => $user->id,
            'date_debut' => $data['date_debut'],
            'date_fin' => $data['date_fin'],
            'montant' => $data['montant'] ?? 0,
            'mode_paiement' => 'cash',
            'etat_reservation' => 'En attente',
        ]);

        // Load relations for the email
        $reservation->load(['machine.cooperative', 'agriculteur']);

        // Send Email to Cooperative
        if ($reservation->machine->cooperative) {
            Mail::to($reservation->machine->cooperative->email)
                ->send(new ReservationRequestMail($reservation));
        }

        // Send Email to Agriculteur
        Mail::to($user->email)->send(new ReservationReceiptMail($reservation));

        return redirect()
            ->route('products.index')
            ->with('success', 'Votre demande de réservation a été envoyée avec succès.');
    }
}
