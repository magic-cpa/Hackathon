import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { ChevronLeft } from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        type_machine: '',
        marque: '',
        modele: '',
        numero_serie: '',
        etat: 'Disponible',
        statut: 'disponible',
        caracteristiques: '',
        tarif_jour: '',
        tarif_semaine: '',
        tarif_mois: '',
        photos: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Ajouter une machine" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('products.table')}
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Retour à la liste
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm sm:rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Informations de la machine</h2>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="type_machine" value="Type de machine" />
                                    <TextInput
                                        id="type_machine"
                                        className="mt-1 block w-full"
                                        value={data.type_machine}
                                        onChange={(e) => setData('type_machine', e.target.value)}
                                        required
                                        placeholder="ex: Tracteur, Moissonneuse"
                                    />
                                    <InputError message={errors.type_machine} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="marque" value="Marque" />
                                    <TextInput
                                        id="marque"
                                        className="mt-1 block w-full"
                                        value={data.marque}
                                        onChange={(e) => setData('marque', e.target.value)}
                                        required
                                        placeholder="ex: John Deere"
                                    />
                                    <InputError message={errors.marque} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="modele" value="Modèle" />
                                    <TextInput
                                        id="modele"
                                        className="mt-1 block w-full"
                                        value={data.modele}
                                        onChange={(e) => setData('modele', e.target.value)}
                                        required
                                        placeholder="ex: 8R 370"
                                    />
                                    <InputError message={errors.modele} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="numero_serie" value="Numéro de série" />
                                    <TextInput
                                        id="numero_serie"
                                        className="mt-1 block w-full"
                                        value={data.numero_serie}
                                        onChange={(e) => setData('numero_serie', e.target.value)}
                                        required
                                        placeholder="ex: SN12345678"
                                    />
                                    <InputError message={errors.numero_serie} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div>
                                    <InputLabel htmlFor="etat" value="État général" />
                                    <select
                                        id="etat"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        value={data.etat}
                                        onChange={(e) => setData('etat', e.target.value)}
                                        required
                                    >
                                        <option value="bon">Bon état</option>
                                        <option value="moyen">État moyen</option>
                                        <option value="mauvais">Mauvais état</option>
                                    </select>
                                    <InputError message={errors.etat} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="statut" value="Statut de disponibilité" />
                                    <select
                                        id="statut"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        value={data.statut}
                                        onChange={(e) => setData('statut', e.target.value)}
                                        required
                                    >
                                        <option value="disponible">Disponible</option>
                                        <option value="occupe">Occupé</option>
                                        <option value="maintenance">En maintenance</option>
                                        <option value="hors_service">Hors service</option>
                                    </select>
                                    <InputError message={errors.statut} className="mt-2" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <InputLabel htmlFor="caracteristiques" value="Caractéristiques / Description" />
                                <textarea
                                    id="caracteristiques"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm min-h-[100px]"
                                    value={data.caracteristiques}
                                    onChange={(e) => setData('caracteristiques', e.target.value)}
                                    placeholder="Décrivez les spécifications techniques..."
                                />
                                <InputError message={errors.caracteristiques} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div>
                                    <InputLabel htmlFor="tarif_jour" value="Tarif jour (DA)" />
                                    <TextInput
                                        id="tarif_jour"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.tarif_jour}
                                        onChange={(e) => setData('tarif_jour', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.tarif_jour} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="tarif_semaine" value="Tarif semaine (DA)" />
                                    <TextInput
                                        id="tarif_semaine"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.tarif_semaine}
                                        onChange={(e) => setData('tarif_semaine', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.tarif_semaine} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="tarif_mois" value="Tarif mois (DA)" />
                                    <TextInput
                                        id="tarif_mois"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.tarif_mois}
                                        onChange={(e) => setData('tarif_mois', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.tarif_mois} className="mt-2" />
                                </div>

                                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <InputLabel htmlFor="photos" value="Photos (max 5) premier fichier = image principale" />

                                    <input
                                        id="photos"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setData('photos', Array.from(e.target.files || []).slice(0, 5))}
                                        className="mt-1 block w-full text-sm text-gray-700 dark:text-gray-200"
                                    />

                                    <InputError message={errors.photos} className="mt-2" />
                                    <InputError message={errors["photos.0"]} className="mt-2" />
                                    <InputError message={errors["photos.1"]} className="mt-2" />
                                    <InputError message={errors["photos.2"]} className="mt-2" />
                                    <InputError message={errors["photos.3"]} className="mt-2" />
                                    <InputError message={errors["photos.4"]} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-10">
                                <PrimaryButton className="w-full sm:w-auto" disabled={processing}>
                                    Créer la machine
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
