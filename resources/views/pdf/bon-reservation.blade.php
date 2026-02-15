<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Bon de réservation</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #111; }
        .box { border: 1px solid #ddd; padding: 12px; border-radius: 8px; }
        .title { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
        .muted { color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        td { padding: 8px 0; vertical-align: top; }
        .label { width: 160px; color: #444; }
        .hr { height: 1px; background: #eee; margin: 14px 0; }
        .right { text-align: right; }
    </style>
</head>
<body>
    <div class="box">
        <div class="title">Bon de réservation</div>
        <div class="muted">Référence: BR-{{ $reservation->id_reservation }}</div>

        <div class="hr"></div>

        <table>
            <tr>
                <td class="label">Client</td>
                <td>{{ $reservation->agriculteur->name }}</td>
            </tr>
            <tr>
                <td class="label">Matériel</td>
                <td>
                    {{ $reservation->machine->type_machine }}<br>
                    {{ $reservation->machine->marque }} {{ $reservation->machine->modele }}
                </td>
            </tr>
            <tr>
                <td class="label">Période</td>
                <td>
                    Du {{ $reservation->date_debut->format('d/m/Y') }}<br>
                    Au {{ $reservation->date_fin->format('d/m/Y') }}
                </td>
            </tr>
            <tr>
                <td class="label">Montant estimé</td>
                <td>{{ number_format($reservation->montant, 2) }} DA</td>
            </tr>
            <tr>
                <td class="label">Statut</td>
                <td>{{ ucfirst($reservation->etat_reservation) }}</td>
            </tr>
            <tr>
                <td class="label">Note</td>
                <td>{{ $reservation->note ?? '-' }}</td>
            </tr>
        </table>

        <div class="hr"></div>

        <div class="right muted">
            Généré le {{ now()->format('d/m/Y H:i') }}
        </div>
    </div>
</body>
</html>
