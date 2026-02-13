<x-mail::message>
# Nouvelle Demande de Réservation

Bonjour,

Un agriculteur souhaite réserver l'un de vos matériels.

**Détails du matériel :**
- **Type :** {{ $reservation->machine->type_machine }}
- **Marque :** {{ $reservation->machine->marque }}
- **Modèle :** {{ $reservation->machine->modele }}

**Détails de la réservation :**
- **De :** {{ $reservation->date_debut->format('d/m/Y') }}
- **À :** {{ $reservation->date_fin->format('d/m/Y') }}
- **Client :** {{ $reservation->agriculteur->name }}
- **Note :** {{ $reservation->note ?? 'N/A' }}
- **Montant estimé :** {{ number_format($reservation->montant, 2) }} DA

<x-mail::button :url="config('app.url') . '/dashboard'">
Voir sur le tableau de bord
</x-mail::button>

Merci,<br>
{{ config('app.name') }}
</x-mail::message>
