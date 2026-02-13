import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useMemo, useState } from "react";
import {
    Search,
    Filter,
    BadgeCheck,
    Settings,
    CalendarDays,
    Eye,
} from "lucide-react";

const formatDA = (v) => {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return "0 DA";
    return `${n.toLocaleString()} DA`;
};

export default function ProductsIndex({ machines = [] }) {
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();

        return machines.filter((m) => {
            const hay = `${m.type_machine} ${m.marque} ${m.modele} ${m.etat}`.toLowerCase();
            const matchText = query.length === 0 || hay.includes(query);
            const matchStatus =
                status === "all" ||
                (m.etat || "").toLowerCase() === status;

            return matchText && matchStatus;
        });
    }, [machines, q, status]);

    return (
        <AuthenticatedLayout>
            <Head title="Nos Produits" />

            {/* Background vert clair */}
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50 py-10">
                <div className="mx-auto max-w-7xl px-4">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-green-800">
                            Toutes les Machines de la Plateforme
                        </h1>
                        <p className="mt-2 text-green-700">
                            Parcourez les équipements agricoles de nos coopérateurs partenaires
                        </p>
                    </div>

                    {/* Barre recherche */}
                    <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center">
                        <div className="relative w-full md:w-1/2">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Rechercher par type, marque ou modèle..."
                                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                            />
                        </div>

                        <div className="relative w-full md:w-1/4">
                            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="disponible">Disponible</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>

                    {/* Grid Produits */}
                    {filtered.length === 0 ? (
                        <div className="text-center text-gray-600">
                            Aucun produit trouvé
                        </div>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((m) => (
                                <div
                                    key={m.id_machine}
                                    className="flex flex-col rounded-2xl bg-white shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden"
                                >
                                    {/* Image */}
                                    <div className="h-52 w-full overflow-hidden">
                                        <img
                                            src={m.image}
                                            alt={m.modele}
                                            className="h-full w-full object-cover hover:scale-105 transition duration-300"
                                        />
                                    </div>

                                    {/* Contenu */}
                                    <div className="flex flex-col flex-1 p-5 text-center">

                                        {/* Nom */}
                                        <h2 className="text-lg font-bold text-gray-800">
                                            {m.marque} {m.modele}
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {m.type_machine}
                                        </p>

                                        {/* Etat */}
                                        <div className="mt-3 flex justify-center">
                                            <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                <BadgeCheck size={14} />
                                                {m.etat}
                                            </span>
                                        </div>

                                        {/* Montant par jour */}
                                        <div className="mt-6">
                                            

                                            <div className="mt-1 text-2xl font-bold text-red-600">
                                                {formatDA(m.tarif_jour)}
                                            </div>
                                            <div className="flex items-center justify-center gap-2 text-sm text-red-700">
                                                <CalendarDays size={16} />
                                                 Par jour
                                            </div>
                                        </div>

                                        {/* Bouton */}
                                        <div className="mt-6">
                                            <Link
                                                href={route("products.show", m.id_machine)}
                                                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-700 hover:shadow-lg"
                                            >
                                                <Eye size={16} />
                                                Voir les détails
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
