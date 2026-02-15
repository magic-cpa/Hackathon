<x-mail::message>
# Nouvelle demande de réservation

Bonjour,

Un agriculteur a soumis une nouvelle demande pour l’un de vos matériels.

---

## Matériel concerné

**Type**
{{ $reservation->machine->type_machine }}

**Marque**
{{ $reservation->machine->marque }}

**Modèle**
{{ $reservation->machine->modele }}

---

## Détails de la réservation

**Période**
Du {{ $reservation->date_debut->format('d/m/Y') }}
Au {{ $reservation->date_fin->format('d/m/Y') }}

**Client**
{{ $reservation->agriculteur->name }}

**Note**
{{ $reservation->note ?? 'Aucune note fournie' }}

**Montant estimé**
{{ number_format($reservation->montant, 2) }} DA

<x-mail::button :url="route('cooperative.reservations.index')">
Consulter la demande
</x-mail::button>

Merci,
{{ config('app.name') }}
</x-mail::message>
