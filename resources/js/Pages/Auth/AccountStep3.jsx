import { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function AccountStep3({ onSubmit, onBack, errors, processing }) {
  const [account, setAccount] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (prefillEmail) {
//       setAccount((prev) => ({ ...prev, email: prefillEmail }));
//     }
//   }, [prefillEmail]);

  const handleChange = (e) => {
    setAccount((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(account);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Étape 3 : Créer le compte
        </h3>
      </div>

      <div>
        <InputLabel htmlFor="name" value="Nom complet" />
        <TextInput
          id="name"
          name="name"
          value={account.name}
          onChange={handleChange}
          className="mt-1 block w-full"
          required
        />
        <InputError message={errors?.name} className="mt-2" />
      </div>

      <div>
        <InputLabel htmlFor="email" value="Adresse e-mail" />
        <TextInput
          id="email"
          type="email"
          name="email"
          value={account.email}
          onChange={handleChange}
          className="mt-1 block w-full bg-gray-100"
          required
        />
        <InputError message={errors?.email} className="mt-2" />
      </div>

      <div>
        <InputLabel htmlFor="password" value="Mot de passe" />
        <div className="relative">
          <TextInput
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={account.password}
            onChange={handleChange}
            className="mt-1 block w-full pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? "Masquer" : "Voir"}
          </button>
        </div>
        <InputError message={errors?.password} className="mt-2" />
      </div>

      <div>
        <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" />
        <TextInput
          id="password_confirmation"
          type={showPassword ? "text" : "password"}
          name="password_confirmation"
          value={account.password_confirmation}
          onChange={handleChange}
          className="mt-1 block w-full pr-10"
          required
        />
        <InputError message={errors?.password_confirmation} className="mt-2" />
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Retour
        </button>
        <PrimaryButton disabled={processing}>
          {processing ? "Création..." : "Créer le compte"}
        </PrimaryButton>
      </div>
    </form>
  );
}
