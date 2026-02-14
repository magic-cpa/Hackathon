<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ProfilCooperative;
use App\Models\ContactCooperative;
use App\Models\ProfilAgriculteur;
use App\Models\ContactAgriculteur;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class MultiStepRegisteredUserController extends Controller
{
    /**
     * Handle multi-step registration for both cooperative and agriculteur
     */
    private function generateAgriculteurIdentifiant(int $userId): string
    {
        return DB::transaction(function () use ($userId) {
            for ($i = 0; $i < 10; $i++) {
                $candidate =
                    'AGRI-' .
                    str_pad((string) $userId, 6, '0', STR_PAD_LEFT) .
                    '-' . strtoupper(Str::random(4));

                $exists = DB::table('profil_agriculteurs')
                    ->where('identifiant', $candidate)
                    ->exists();

                if (!$exists) return $candidate;
            }

            throw new \RuntimeException('Unable to generate unique identifiant');
        });
    }

    public function store(Request $request): JsonResponse
    {
        try {
            // Validate common fields
            $validated = $request->validate([
                'type' => 'required|in:cooperative,agriculteur',
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            // Validate type-specific profile and contact data
            if ($request->type === 'cooperative') {
                $request->validate([
                    'profil' => 'required|array',
                    'profil.raison_sociale' => 'required|string|max:255',
                    'profil.telephone' => 'nullable|string',
                    'profil.fax' => 'nullable|string',
                    'profil.site_web' => 'nullable',
                    'profil.lien_google_maps' => 'nullable',
                    'profil.adresse_ligne' => 'nullable|string',
                    'profil.wilaya' => 'required|string|max:100',
                    'profil.commune' => 'required|string|max:100',

                    'contact' => 'required|array',
                    'contact.nom' => 'required|string|max:100',
                    'contact.prenom' => 'required|string|max:100',
                    'contact.numero_poste' => 'nullable|string',
                    'contact.telephone_mobile' => 'nullable|string',
                    'contact.fax' => 'nullable|string',
                    'contact.email_contact' => 'required|email',
                ]);
            } else if ($request->type === 'agriculteur') {
                $request->validate([
                    'profil' => 'required|array',
                    'profil.raison_sociale' => 'required|string|max:255',
                    'profil.telephone_exploitation' => 'nullable|string',
                    'profil.fax' => 'nullable|string',
                    'profil.site_web' => 'nullable',
                    'profil.lien_google_maps' => 'nullable|',
                    'profil.adresse_ligne' => 'nullable|string',
                    'profil.wilaya' => 'required|string|max:100',
                    'profil.commune' => 'required|string|max:100',

                    'contact' => 'required|array',
                    'contact.nom' => 'required|string|max:100',
                    'contact.prenom' => 'required|string|max:100',
                    'contact.telephone_fixe' => 'nullable|string',
                    'contact.numero_poste' => 'nullable|string',
                    'contact.telephone_mobile' => 'nullable|string',
                    'contact.fax' => 'nullable|string',
                    'contact.email_contact' => 'required|email',
                ]);
            }

            // Create user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Create profile and contact based on type
            if ($request->type === 'cooperative') {
                ProfilCooperative::create([
                    'id_user' => $user->id,
                    'raison_sociale' => $request->profil['raison_sociale'],
                    'telephone_standard' => $request->profil['telephone'] ?? null,
                    'fax' => $request->profil['fax'] ?? null,
                    'site_web' => $request->profil['site_web'] ?? null,
                    'lien_google_maps' => $request->profil['lien_google_maps'] ?? null,
                    'adresse_ligne' => $request->profil['adresse_ligne'] ?? null,
                    'wilaya' => $request->profil['wilaya'],
                    'commune' => $request->profil['commune'],
                ]);

                ContactCooperative::create([
                    'id_user' => $user->id,
                    'nom' => $request->contact['nom'],
                    'prenom' => $request->contact['prenom'],
                    'numero_poste' => $request->contact['numero_poste'] ?? null,
                    'telephone_mobile' => $request->contact['telephone_mobile'] ?? null,
                    'fax' => $request->contact['fax'] ?? null,
                    'email_contact' => $request->contact['email_contact'],
                ]);

                // Assign cooperative role
                $user->assignRole('cooperative');
            } else if ($request->type === 'agriculteur') {

                $identifiant = $this->generateAgriculteurIdentifiant($user->id);

                ProfilAgriculteur::create([
                    'id_user' => $user->id,
                    'identifiant' => $identifiant,
                    'raison_sociale' => $request->profil['raison_sociale'],
                    'telephone_exploitation' => $request->profil['telephone_exploitation'] ?? null,
                    'fax' => $request->profil['fax'] ?? null,
                    'site_web' => $request->profil['site_web'] ?? null,
                    'lien_google_maps' => $request->profil['lien_google_maps'] ?? null,
                    'adresse_ligne' => $request->profil['adresse_ligne'] ?? null,
                    'wilaya' => $request->profil['wilaya'],
                    'commune' => $request->profil['commune'],
                ]);

                ContactAgriculteur::create([
                    'id_user' => $user->id,
                    'nom' => $request->contact['nom'],
                    'prenom' => $request->contact['prenom'],
                    'telephone_fixe' => $request->contact['telephone_fixe'] ?? null,
                    'numero_poste' => $request->contact['numero_poste'] ?? null,
                    'telephone_mobile' => $request->contact['telephone_mobile'] ?? null,
                    'fax' => $request->contact['fax'] ?? null,
                    'email_contact' => $request->contact['email_contact'],
                ]);

                $user->assignRole('agriculteur');
            }

            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'user' => $user,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
