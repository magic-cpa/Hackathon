<x-mail::message>
# Confirmation de votre demande de réservation

Bonjour {{ $reservation->agriculteur->name }},

Votre demande a bien été transmise à la coopérative.
Elle sera traitée dans les meilleurs délais.

---

## Matériel concerné

**Type**
{{ $reservation->machine->type_machine }}

**Marque**
{{ $reservation->machine->marque }}

**Modèle**
{{ $reservation->machine->modele }}

---

## Détails de votre demande

**Période**
Du {{ $reservation->date_debut->format('d/m/Y') }}
Au {{ $reservation->date_fin->format('d/m/Y') }}

**Montant estimé**
{{ number_format($reservation->montant, 2) }} DA

**Statut actuel**
{{ ucfirst($reservation->etat_reservation) }}

---

Vous serez notifié dès qu’une décision sera prise.

<x-mail::button :url="route('dashboard')">
Suivre ma réservation
</x-mail::button>

Merci,
{{ config('app.name') }}
</x-mail::message>
