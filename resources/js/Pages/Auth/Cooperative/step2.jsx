import { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function CooperativeStep2({ onNext, onBack, initialData = null }) {
  const [contact, setContact] = useState(
    initialData || {
      nom: "",
      prenom: "",
      numero_poste: "",
      telephone_mobile: "",
      fax: "",
      email_contact: "",
    }
  );

  const handleChange = (e) => {
    setContact((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(contact);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Step 2: Contact Information
        </h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-bold">
            ✓
          </div>
          <div className="h-1 w-8 bg-indigo-600"></div>
          <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-bold">
            2
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputLabel htmlFor="nom" value="Last Name" />
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
          <InputLabel htmlFor="prenom" value="First Name" />
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

      <div>
        <InputLabel htmlFor="numero_poste" value="Position Number (Optional)" />
        <TextInput
          id="numero_poste"
          name="numero_poste"
          value={contact.numero_poste}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <InputLabel htmlFor="telephone_mobile" value="Mobile Phone" />
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
        <InputLabel htmlFor="fax" value="Fax (Optional)" />
        <TextInput
          id="fax"
          name="fax"
          value={contact.fax}
          onChange={handleChange}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <InputLabel htmlFor="email_contact" value="Contact Email" />
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

      <div className="flex items-center justify-between pt-6 border-t dark:border-gray-600">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          ← Back
        </button>

        <PrimaryButton>Continue →</PrimaryButton>
      </div>
    </form>
  );
}

