import { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import WilayaSelect from "@/Components/WilayaSelect";

export default function AgriculteurStep1({ onNext, onBack, initialData = null }) {
  const [profil, setProfil] = useState(
    initialData ?? {
      raison_sociale: "",
      telephone_exploitation: "",
      fax: "",
      site_web: "",
      lien_google_maps: "",
      adresse_ligne: "",
      wilaya: "",
      commune: "",
    }
  );

  const handleChange = (e) => {
    // Sécurise si c'est un vrai event
    if (e?.target) {
      setProfil((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Gestion spéciale si WilayaSelect renvoie juste la valeur
  const handleWilayaChange = (value) => {
    setProfil((prev) => ({
      ...prev,
      wilaya: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!profil.raison_sociale || !profil.adresse_ligne || !profil.wilaya || !profil.commune) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    onNext(profil);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Étape 1 : Profil de la ferme
        </h3>

        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-bold">
            1
          </div>
          <div className="h-1 w-8 bg-gray-300"></div>
          <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-600 rounded-full text-sm font-bold">
            2
          </div>
        </div>
      </div>

      <div>
        <InputLabel htmlFor="raison_sociale" value="Nom de la ferme (Raison Sociale)" />
        <TextInput
          id="raison_sociale"
          name="raison_sociale"
          value={profil.raison_sociale}
          onChange={handleChange}
          className="mt-1 block w-full"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel htmlFor="telephone_exploitation" value="Téléphone de la ferme" />
          <TextInput
            id="telephone_exploitation"
            name="telephone_exploitation"
            value={profil.telephone_exploitation}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <InputLabel htmlFor="fax" value="Fax" />
          <TextInput
            id="fax"
            name="fax"
            value={profil.fax}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>
      </div>

      <div>
        <InputLabel htmlFor="site_web" value="Site web" />
        <TextInput
          id="site_web"
          name="site_web"
          value={profil.site_web}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <InputLabel htmlFor="lien_google_maps" value="Lien Google Maps" />
        <TextInput
          id="lien_google_maps"
          name="lien_google_maps"
          value={profil.lien_google_maps}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <InputLabel htmlFor="adresse_ligne" value="Adresse de la ferme" />
        <TextInput
          id="adresse_ligne"
          name="adresse_ligne"
          value={profil.adresse_ligne}
          onChange={handleChange}
          className="mt-1 block w-full"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <WilayaSelect
            name="wilaya"
            value={profil.wilaya}
            onChange={handleWilayaChange}
            required
          />
        </div>

        <div>
          <InputLabel htmlFor="commune" value="Commune" />
          <TextInput
            id="commune"
            name="commune"
            value={profil.commune}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Retour
        </button>

        <PrimaryButton type="submit">
          Suivant →
        </PrimaryButton>
      </div>
    </form>
  );
}
