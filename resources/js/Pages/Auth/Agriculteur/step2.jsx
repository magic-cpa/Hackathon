import { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function AgriculteurStep2({
  onNext,
  onBack,
  initialData = null,
  setEmailParent,
}) {
  const [contact, setContact] = useState(
    initialData ?? {
      nom: "",
      prenom: "",
      telephone_fixe: "",
      numero_poste: "",
      telephone_mobile: "",
      fax: "",
      email_contact: "",
    }
  );

  // Envoie l’email au parent pour pré-remplir Step3
  useEffect(() => {
    if (setEmailParent && contact.email_contact) {
      setEmailParent(contact.email_contact);
    }
  }, [contact.email_contact, setEmailParent]);

  const handleChange = (e) => {
    if (e?.target) {
      setContact((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !contact.nom ||
      !contact.prenom ||
      !contact.telephone_mobile ||
      !contact.email_contact
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    onNext(contact);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Étape 2 : Informations de contact
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel htmlFor="nom" value="Nom de famille" />
          <TextInput
            id="nom"
            name="nom"
            value={contact.nom}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>

        <div>
          <InputLabel htmlFor="prenom" value="Prénom" />
          <TextInput
            id="prenom"
            name="prenom"
            value={contact.prenom}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel
            htmlFor="telephone_fixe"
            value="Téléphone fixe (facultatif)"
          />
          <TextInput
            id="telephone_fixe"
            name="telephone_fixe"
            value={contact.telephone_fixe}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <InputLabel
            htmlFor="numero_poste"
            value="Numéro de poste (facultatif)"
          />
          <TextInput
            id="numero_poste"
            name="numero_poste"
            value={contact.numero_poste}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>
      </div>

      <div>
        <InputLabel htmlFor="telephone_mobile" value="Téléphone mobile" />
        <TextInput
          id="telephone_mobile"
          name="telephone_mobile"
          value={contact.telephone_mobile}
          onChange={handleChange}
          className="mt-1 block w-full"
          required
        />
      </div>

      <div>
        <InputLabel htmlFor="fax" value="Fax (facultatif)" />
        <TextInput
          id="fax"
          name="fax"
          value={contact.fax}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <InputLabel htmlFor="email_contact" value="Adresse e-mail" />
        <TextInput
          id="email_contact"
          type="email"
          name="email_contact"
          value={contact.email_contact}
          onChange={handleChange}
          className="mt-1 block w-full"
          required
        />
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
