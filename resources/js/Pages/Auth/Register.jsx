import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import axios from "axios";
import CooperativeStep1 from "@/Pages/Auth/Cooperative/step1";
import CooperativeStep2 from "@/Pages/Auth/Cooperative/step2";
import AgriculteurStep1 from "@/Pages/Auth/Agriculteur/step1";
import AgriculteurStep2 from "@/Pages/Auth/Agriculteur/step2";
import AccountStep3 from "@/Pages/Auth/AccountStep3";
import BgImage from "@/assets/bglogin.jpg";

export default function Register() {
  const [accountType, setAccountType] = useState(null);
  const [step, setStep] = useState(0);
  const [profilData, setProfilData] = useState(null);
  const [contactData, setContactData] = useState(null);

  const selectType = (type) => {
    setAccountType(type);
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
      ...account,
      profil: profilData,
      contact: contactData,
    };
    try {
      await axios.post("/register-wizard", payload);
      setStep(4);
      setTimeout(() => (window.location.href = "/dashboard"), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBack = (targetStep) => setStep(targetStep);

  return (
    <>
      <Head title="Inscription" />

      <div
        className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${BgImage})` }}
      >
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Card centrée */}
        <div className="relative z-10 w-full max-w-3xl h-[90vh] bg-white rounded-3xl shadow-2xl p-8 flex flex-col overflow-hidden">
          
          {/* Progress bar */}
          <div className="flex justify-between mb-6">
            {[0,1,2,3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 mx-1 rounded-full transition-all duration-500 ${
                  step > s ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Contenu central */}
          <div className="flex-1 overflow-auto px-4">
            {/* Step 0: Choix du type */}
            {step === 0 && (
              <div className="text-center flex flex-col items-center justify-center h-full space-y-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-800">
                  Choisissez votre type de compte
                </h2>
                <div className="flex flex-col md:flex-row gap-6 mt-6 w-full justify-center">
                  <button
                    onClick={() => selectType("cooperative")}
                    className="flex-1 py-5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition transform hover:scale-105"
                  >
                    🏢 Coopérative
                  </button>
                  <button
                    onClick={() => selectType("agriculteur")}
                    className="flex-1 py-5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg transition transform hover:scale-105"
                  >
                    🚜 Agriculteur
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Profil */}
            {step === 1 && (
              <div className="animate-slide-in h-full flex flex-col">
                {accountType === "cooperative" ? (
                  <CooperativeStep1
                    onNext={handleProfilNext}
                    onBack={() => handleBack(0)}
                    initialData={profilData}
                    hideIdentifiant={true} 
                    frText={{ title: "Profil de la coopérative" }}
                  />
                ) : (
                  <AgriculteurStep1
                    onNext={handleProfilNext}
                    onBack={() => handleBack(0)}
                    initialData={profilData}
                    hideIdentifiant={true} 
                    frText={{ title: "Profil de l'agriculteur" }}
                  />
                )}
              </div>
            )}

            {/* Step 2: Contact */}
            {step === 2 && (
              <div className="animate-slide-in h-full flex flex-col">
                {accountType === "cooperative" ? (
                  <CooperativeStep2
                    onNext={handleContactNext}
                    onBack={() => handleBack(1)}
                    initialData={contactData}
                    frText={{ title: "Informations de contact" }}
                  />
                ) : (
                  <AgriculteurStep2
                    onNext={handleContactNext}
                    onBack={() => handleBack(1)}
                    initialData={contactData}
                    frText={{ title: "Informations de contact" }}
                  />
                )}
              </div>
            )}

            {/* Step 3: Compte */}
            {step === 3 && (
              <div className="animate-slide-in h-full flex flex-col">
                <AccountStep3
                  onSubmit={handleAccountSubmit}
                  onBack={() => handleBack(2)}
                  frText={{ title: "Créer votre compte" }}
                />
              </div>
            )}

            {/* Step 4: Succès */}
            {step === 4 && (
              <div className="text-center py-12 animate-bounce-in">
                <svg
                  className="mx-auto h-16 w-16 text-green-600 mb-4"
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
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Inscription réussie !
                </h3>
                <p className="text-gray-600">
                  Votre compte a été créé. Vous allez être redirigé vers votre dashboard...
                </p>
              </div>
            )}
          </div>

          {/* Bouton Retour au login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-block py-3 px-6 rounded-xl bg-gray-200 hover:bg-gray-300 
                        text-gray-800 font-semibold shadow-md transition transform hover:scale-105"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
