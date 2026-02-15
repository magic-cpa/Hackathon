<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReservationPdfController extends Controller
{
    public function show(Request $request, Reservation $reservation)
    {
        $reservation->load(['machine', 'agriculteur']);

        $pdf = Pdf::loadView('pdf.bon-reservation', [
            'reservation' => $reservation,
        ])->setPaper('a4');

        $fileName = 'bon-reservation-' . $reservation->id_reservation . '.pdf';

        return $pdf->download($fileName);
    }
}
