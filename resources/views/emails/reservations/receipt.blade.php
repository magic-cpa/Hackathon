<x-mail::message>
# Confirmation de votre demande de réservation

Bonjour {{ $reservation->agriculteur->name }},

Votre demande de réservation a été envoyée avec succès à la coopérative.

**Détails du matériel :**
- **Type :** {{ $reservation->machine->type_machine }}
- **Marque :** {{ $reservation->machine->marque }}
- **Modèle :** {{ $reservation->machine->modele }}

**Détails de votre demande :**
- **Période :** Du {{ $reservation->date_debut->format('d/m/Y') }} au {{ $reservation->date_fin->format('d/m/Y') }}
- **Montant estimé :** {{ number_format($reservation->montant, 2) }} DA
- **Statut :** {{ $reservation->etat_reservation }}

Vous recevrez une notification dès que la coopérative aura traité votre demande.

<x-mail::button :url="config('app.url') . '/dashboard'">
Suivre ma réservation
</x-mail::button>

Merci,<br>
{{ config('app.name') }}
</x-mail::message>
