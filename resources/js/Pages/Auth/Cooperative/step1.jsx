import { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import WilayaSelect from "@/Components/WilayaSelect";


export default function CooperativeStep1({ onNext, onBack, initialData = null }) {
    const [profil, setProfil] = useState(
        initialData || {
            
            raison_sociale: "",
            telephone: "",
            fax: "",
            site_web: "",
            lien_google_maps: "",
            adresse_ligne: "",
            wilaya: "",
            commune: "",
        }
    );

    const handleChange = (e) => {
        setProfil((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext(profil);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Step 1: Cooperative Profile
                </h3>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-bold">
                        1
                    </div>
                    <div className="h-1 w-8 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-sm font-bold">
                        2
                    </div>
                </div>
            </div>



            <div>
                <InputLabel htmlFor="raison_sociale" value="Business Name (Raison Sociale)" />
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
                    <InputLabel htmlFor="telephone" value="Telephone" />
                    <TextInput
                        id="telephone"
                        name="telephone"
                        value={profil.telephone}
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
                <InputLabel htmlFor="site_web" value="Website" />
                <TextInput
                    id="site_web"
                    name="site_web"
                    value={profil.site_web}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                />
            </div>

            <div>
                <InputLabel htmlFor="lien_google_maps" value="Google Maps Link" />
                <TextInput
                    id="lien_google_maps"
                    name="lien_google_maps"
                    value={profil.lien_google_maps}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                />
            </div>

            <div>
                <InputLabel htmlFor="adresse_ligne" value="Address" />
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
                        value={profil.wilaya}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <InputLabel htmlFor="commune" value="Commune (City)" />
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

            <div className="flex items-center justify-between pt-6 border-t dark:border-gray-600">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                    ← Back
                </button>

                <PrimaryButton>Next →</PrimaryButton>
            </div>
        </form>
    );
}

