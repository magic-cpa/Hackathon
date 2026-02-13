import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import axios from "axios";
import CooperativeStep1 from "@/Pages/Auth/Cooperative/step1";
import CooperativeStep2 from "@/Pages/Auth/Cooperative/step2";
import AgriculteurStep1 from "@/Pages/Auth/Agriculteur/step1";
import AgriculteurStep2 from "@/Pages/Auth/Agriculteur/step2";
import AccountStep3 from "@/Pages/Auth/AccountStep3";

export default function Register() {
  const [accountType, setAccountType] = useState(null);
  const [step, setStep] = useState(0); // 0=choice, 1=profil, 2=contact, 3=account, 4=done

  const [profilData, setProfilData] = useState(null);
  const [contactData, setContactData] = useState(null);

  const { data, setData, processing, errors } = useForm({
    type: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const selectType = (type) => {
    setAccountType(type);
    setData("type", type);
    setStep(1);
  };

  const handleProfilNext = (profil) => {
    setProfilData(profil);
    setStep(2);
  };

  const handleContactNext = (contact) => {
    setContactData(contact);
    setStep(3);
  };

  const handleAccountSubmit = async (account) => {
    const payload = {
      type: accountType,
      name: account.name,
      email: account.email,
      password: account.password,
      password_confirmation: account.password_confirmation,
      profil: profilData,
      contact: contactData,
    };

    try {
      const response = await axios.post("/register-wizard", payload);
      setStep(4);
      // Redirect or handle success
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      // Handle error - show in form errors
    }
  };

  const handleBack = (targetStep) => {
    setStep(targetStep);
  };

  return (
    <GuestLayout>
      <Head title="Register" />

      {/* Step 0: Type Selection */}
      {step === 0 && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Choose your registration type
          </h2>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => selectType("cooperative")}
              className="w-full py-3 rounded-lg font-semibold transition bg-gray-200 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-gray-900 dark:text-white"
            >
              🏢 Register as Cooperative
            </button>

            <button
              type="button"
              onClick={() => selectType("agriculteur")}
              className="w-full py-3 rounded-lg font-semibold transition bg-gray-200 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900 text-gray-900 dark:text-white"
            >
              🚜 Register as Agriculteur
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Profil */}
      {step === 1 && accountType === "cooperative" && (
        <CooperativeStep1
          onNext={handleProfilNext}
          onBack={() => handleBack(0)}
          initialData={profilData}
        />
      )}

      {step === 1 && accountType === "agriculteur" && (
        <AgriculteurStep1
          onNext={handleProfilNext}
          onBack={() => handleBack(0)}
          initialData={profilData}
        />
      )}

      {/* Step 2: Contact */}
      {step === 2 && accountType === "cooperative" && (
        <CooperativeStep2
          onNext={handleContactNext}
          onBack={() => handleBack(1)}
          initialData={contactData}
        />
      )}

      {step === 2 && accountType === "agriculteur" && (
        <AgriculteurStep2
          onNext={handleContactNext}
          onBack={() => handleBack(1)}
          initialData={contactData}
        />
      )}

      {/* Step 3: Account */}
      {step === 3 && (
        <AccountStep3
          onSubmit={handleAccountSubmit}
          onBack={() => handleBack(2)}
          errors={errors}
          processing={processing}
        />
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Registration Successful!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your account has been created. You will be redirected shortly...
          </p>
        </div>
      )}
    </GuestLayout>
  );
}

