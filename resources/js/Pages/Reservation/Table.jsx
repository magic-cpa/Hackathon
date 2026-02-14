import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AppSidebar from "@/Components/AppSidebar";
import { Check, X as Close, Search, X, Eye, Calendar, User as UserIcon } from "lucide-react";
import Swal from "sweetalert2";
import { useMemo, useState } from "react";

const money = (v) => {
    const n = Number(v ?? 0);
    if (!Number.isFinite(n)) return "0";
    return n.toLocaleString();
};

const badgeClass = (statut) => {
    const s = String(statut ?? "").toLowerCase();
    if (s === "validé" || s === "valide")
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (s === "en attente")
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (s === "refusé" || s === "refuse")
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (s === "terminé" || s === "termine")
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
};

export default function Table({ reservations = [] }) {
    const { patch } = useForm();
    const { auth } = usePage().props;
    const userRole = auth?.user?.roles?.[0] || "agriculteur";

    const [q, setQ] = useState("");
    const [statut, setStatut] = useState("all");
    const [sortKey, setSortKey] = useState("id_reservation");
    const [sortDir, setSortDir] = useState("desc");
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const updateStatus = (id, newStatus) => {
        const title = newStatus === 'Validé' ? 'Valider cette réservation ?' : 'Refuser cette réservation ?';
        const confirmButtonColor = newStatus === 'Validé' ? '#10b981' : '#ef4444';

        Swal.fire({
            title: title,
            text: "Le statut de la réservation sera mis à jour.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: confirmButtonColor,
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Oui, confirmer !",
            cancelButtonText: "Annuler",
        }).then((result) => {
            if (!result.isConfirmed) return;

            patch(route("cooperative.reservations.update", id),
                { etat_reservation: newStatus },
                {
                    onSuccess: () => {
                        Swal.fire("Mis à jour !", `La réservation a été ${newStatus.toLowerCase()}.`, "success");
                    },
                }
            );
        });
    };

    const normalized = useMemo(() => {
        const text = (s) => String(s ?? "").toLowerCase();

        return reservations.map((r) => ({
            ...r,
            _search: [
                r.machine?.marque,
                r.machine?.modele,
                r.agriculteur?.name,
                r.etat_reservation,
            ]
                .map(text)
                .join(" "),
        }));
    }, [reservations]);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();

        let arr = normalized;

        if (query) {
            arr = arr.filter((m) => m._search.includes(query));
        }

        if (statut !== "all") {
            arr = arr.filter((m) => String(m.etat_reservation) === statut);
        }

        const dir = sortDir === "asc" ? 1 : -1;

        const getVal = (m) => {
            if (sortKey === "machine") return `${m.machine?.marque ?? ""} ${m.machine?.modele ?? ""}`.toLowerCase();
            if (sortKey === "agriculteur") return (m.agriculteur?.name ?? "").toLowerCase();
            if (sortKey === "montant") return Number(m.montant ?? 0);
            if (sortKey === "date_debut") return new Date(m.date_debut).getTime();
            return m[sortKey];
        };

        arr = [...arr].sort((a, b) => {
            const av = getVal(a);
            const bv = getVal(b);

            if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;

            const as = String(av ?? "");
            const bs = String(bv ?? "");
            return as.localeCompare(bs) * dir;
        });

        return arr;
    }, [normalized, q, statut, sortKey, sortDir]);

    const total = filtered.length;

    const maxPage = useMemo(() => {
        if (!total) return 1;
        return Math.max(1, Math.ceil(total / perPage));
    }, [total, perPage]);

    const paged = useMemo(() => {
        const safePage = Math.min(Math.max(1, page), maxPage);
        const start = (safePage - 1) * perPage;
        const end = start + perPage;
        return filtered.slice(start, end);
    }, [filtered, page, perPage, maxPage]);

    const setSort = (key) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
            return;
        }
        setSortKey(key);
        setSortDir("asc");
    };

    const resetFilters = () => {
        setQ("");
        setStatut("all");
        setSortKey("id_reservation");
        setSortDir("desc");
        setPerPage(10);
        setPage(1);
    };

    const from = total ? (Math.min(page, maxPage) - 1) * perPage + 1 : 0;
    const to = total ? Math.min(from + perPage - 1, total) : 0;

    return (
        <AuthenticatedLayout>
            <Head title="Demandes de Réservation" />

            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                <AppSidebar role={userRole} />

                <div className="flex-1 py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestion des Réservations
                            </h2>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {total} demande(s) trouvée(s)
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 shadow-sm sm:rounded-2xl border border-gray-200 dark:border-gray-800">
                        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                                <div className="lg:col-span-6">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            value={q}
                                            onChange={(e) => {
                                                setQ(e.target.value);
                                                setPage(1);
                                            }}
                                            placeholder="Rechercher par machine ou agriculteur..."
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 pl-9 pr-10 py-2 text-sm outline-none focus:border-gray-300 dark:focus:border-gray-700"
                                        />
                                        {q && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setQ("");
                                                    setPage(1);
                                                }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                                title="Effacer"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-3">
                                    <select
                                        value={statut}
                                        onChange={(e) => {
                                            setStatut(e.target.value);
                                            setPage(1);
                                        }}
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none"
                                    >
                                        <option value="all">Tous les statuts</option>
                                        <option value="En attente">En attente</option>
                                        <option value="Validé">Validé</option>
                                        <option value="Refusé">Refusé</option>
                                        <option value="Terminé">Terminé</option>
                                    </select>
                                </div>

                                <div className="lg:col-span-2">
                                    <select
                                        value={perPage}
                                        onChange={(e) => {
                                            setPerPage(Number(e.target.value));
                                            setPage(1);
                                        }}
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none"
                                    >
                                        <option value={5}>5 / page</option>
                                        <option value={10}>10 / page</option>
                                        <option value={20}>20 / page</option>
                                    </select>
                                </div>

                                <div className="lg:col-span-1 flex justify-start lg:justify-end">
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="w-full lg:w-auto rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-950"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            <button
                                                type="button"
                                                onClick={() => setSort("machine")}
                                                className="hover:text-gray-900 dark:hover:text-white"
                                            >
                                                Machine {sortKey === "machine" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                                            </button>
                                        </th>

                                        <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            <button
                                                type="button"
                                                onClick={() => setSort("agriculteur")}
                                                className="hover:text-gray-900 dark:hover:text-white"
                                            >
                                                Agriculteur {sortKey === "agriculteur" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                                            </button>
                                        </th>

                                        <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            <button
                                                type="button"
                                                onClick={() => setSort("date_debut")}
                                                className="hover:text-gray-900 dark:hover:text-white"
                                            >
                                                Période {sortKey === "date_debut" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                                            </button>
                                        </th>

                                        <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            <button
                                                type="button"
                                                onClick={() => setSort("montant")}
                                                className="hover:text-gray-900 dark:hover:text-white"
                                            >
                                                Montant {sortKey === "montant" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                                            </button>
                                        </th>

                                        <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Statut
                                        </th>

                                        <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {paged.map((r) => (
                                        <tr
                                            key={r.id_reservation}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                                        >
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="min-w-[180px]">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {r.machine?.marque} {r.machine?.modele}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        ID: #{r.id_reservation}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                                                    <span className="text-sm text-gray-900 dark:text-white">
                                                        {r.agriculteur?.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col text-xs text-gray-600 dark:text-gray-300">
                                                    <span className="flex items-center">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        Du: {new Date(r.date_debut).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center mt-1">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        Au: {new Date(r.date_fin).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {money(r.montant)} DA
                                            </td>

                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${badgeClass(
                                                        r.etat_reservation
                                                    )}`}
                                                >
                                                    {r.etat_reservation}
                                                </span>
                                            </td>

                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {r.etat_reservation === 'En attente' && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateStatus(r.id_reservation, 'Validé')}
                                                                className="inline-flex items-center p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 transition-colors"
                                                                title="Valider"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateStatus(r.id_reservation, 'Refusé')}
                                                                className="inline-flex items-center p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
                                                                title="Refuser"
                                                            >
                                                                <Close className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <Link
                                                        href={route("products.show", r.id_machine)}
                                                        className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                                        title="Voir machine"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {paged.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                                                Aucune demande de réservation trouvée
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {from} à {to} sur {total}
                            </div>

                            <div className="flex items-center gap-2 justify-between sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setPage(1)}
                                    disabled={page <= 1}
                                    className={`rounded-xl px-3 py-2 text-sm font-semibold border ${page <= 1
                                        ? "cursor-not-allowed border-gray-200 dark:border-gray-800 text-gray-400"
                                        : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-950"
                                        }`}
                                >
                                    «
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className={`rounded-xl px-3 py-2 text-sm font-semibold border ${page <= 1
                                        ? "cursor-not-allowed border-gray-200 dark:border-gray-800 text-gray-400"
                                        : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-950"
                                        }`}
                                >
                                    Précédent
                                </button>

                                <div className="text-sm text-gray-700 dark:text-gray-200 px-2">
                                    Page {Math.min(page, maxPage)} / {maxPage}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                                    disabled={page >= maxPage}
                                    className={`rounded-xl px-3 py-2 text-sm font-semibold border ${page >= maxPage
                                        ? "cursor-not-allowed border-gray-200 dark:border-gray-800 text-gray-400"
                                        : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-950"
                                        }`}
                                >
                                    Suivant
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPage(maxPage)}
                                    disabled={page >= maxPage}
                                    className={`rounded-xl px-3 py-2 text-sm font-semibold border ${page >= maxPage
                                        ? "cursor-not-allowed border-gray-200 dark:border-gray-800 text-gray-400"
                                        : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-950"
                                        }`}
                                >
                                    »
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
