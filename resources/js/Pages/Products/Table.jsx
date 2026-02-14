import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AppSidebar from "@/Components/AppSidebar";
import { Plus, Edit, Trash2, Eye, Search, X } from "lucide-react";
import Swal from "sweetalert2";
import { useMemo, useState } from "react";

const money = (v) => {
  const n = Number(v ?? 0);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
};

const badgeClass = (statut) => {
  if (statut === "disponible")
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  if (statut === "occupe")
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  if (statut === "maintenance")
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
};

export default function Table({ machines = [] }) {
  const { delete: destroy } = useForm();
  const { auth } = usePage().props;

  const userRole = auth?.user?.roles?.[0] || "agriculteur";

  const [q, setQ] = useState("");
  const [statut, setStatut] = useState("all");
  const [etat, setEtat] = useState("all");
  const [sortKey, setSortKey] = useState("id_machine");
  const [sortDir, setSortDir] = useState("desc");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const deleteMachine = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (!result.isConfirmed) return;

      destroy(route("products.destroy", id), {
        onSuccess: () => {
          Swal.fire("Supprimé !", "La machine a été supprimée.", "success");
        },
      });
    });
  };

  const normalized = useMemo(() => {
    const text = (s) => String(s ?? "").toLowerCase();

    return machines.map((m) => ({
      ...m,
      _search: [
        m.marque,
        m.modele,
        m.type_machine,
        m.numero_serie,
        m.statut,
        m.etat,
      ]
        .map(text)
        .join(" "),
    }));
  }, [machines]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    let arr = normalized;

    if (query) {
      arr = arr.filter((m) => m._search.includes(query));
    }

    if (statut !== "all") {
      arr = arr.filter((m) => String(m.statut) === statut);
    }

    if (etat !== "all") {
      arr = arr.filter((m) => String(m.etat) === etat);
    }

    const dir = sortDir === "asc" ? 1 : -1;

    const getVal = (m) => {
      if (sortKey === "machine") return `${m.marque ?? ""} ${m.modele ?? ""}`.toLowerCase();
      if (sortKey === "tarif_jour") return Number(m.tarif_jour ?? 0);
      if (sortKey === "tarif_semaine") return Number(m.tarif_semaine ?? 0);
      if (sortKey === "tarif_mois") return Number(m.tarif_mois ?? 0);
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
  }, [normalized, q, statut, etat, sortKey, sortDir]);

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
    setEtat("all");
    setSortKey("id_machine");
    setSortDir("desc");
    setPerPage(10);
    setPage(1);
  };

  const from = total ? (Math.min(page, maxPage) - 1) * perPage + 1 : 0;
  const to = total ? Math.min(from + perPage - 1, total) : 0;

  return (
    <AuthenticatedLayout>
      <Head title="Mes Machines" />

      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppSidebar role={userRole} />

        <div className="flex-1 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Mes Machines Agricoles
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {total} résultat(s)
              </div>
            </div>

            <Link
              href={route("products.create")}
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une machine
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-900 shadow-sm sm:rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={q}
                      onChange={(e) => {
                        setQ(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Rechercher marque modèle type série"
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

                <div className="lg:col-span-2">
                  <select
                    value={statut}
                    onChange={(e) => {
                      setStatut(e.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none"
                  >
                    <option value="all">Tous statuts</option>
                    <option value="disponible">Disponible</option>
                    <option value="occupe">Occupé</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="hors_service">Hors service</option>
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <select
                    value={etat}
                    onChange={(e) => {
                      setEtat(e.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm outline-none"
                  >
                    <option value="all">Tous états</option>
                    <option value="bon">Bon</option>
                    <option value="moyen">Moyen</option>
                    <option value="mauvais">Mauvais</option>
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
                    <option value={50}>50 / page</option>
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
                        onClick={() => setSort("statut")}
                        className="hover:text-gray-900 dark:hover:text-white"
                      >
                        Statut {sortKey === "statut" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                      </button>
                    </th>

                    <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <button
                        type="button"
                        onClick={() => setSort("etat")}
                        className="hover:text-gray-900 dark:hover:text-white"
                      >
                        État {sortKey === "etat" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                      </button>
                    </th>

                    <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <button
                        type="button"
                        onClick={() => setSort("tarif_jour")}
                        className="hover:text-gray-900 dark:hover:text-white"
                      >
                        Tarif jour {sortKey === "tarif_jour" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                      </button>
                    </th>

                    <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <button
                        type="button"
                        onClick={() => setSort("tarif_semaine")}
                        className="hover:text-gray-900 dark:hover:text-white"
                      >
                        Tarif semaine {sortKey === "tarif_semaine" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                      </button>
                    </th>

                    <th className="px-4 sm:px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <button
                        type="button"
                        onClick={() => setSort("tarif_mois")}
                        className="hover:text-gray-900 dark:hover:text-white"
                      >
                        Tarif mois {sortKey === "tarif_mois" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                      </button>
                    </th>

                    <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {paged.map((machine) => (
                    <tr
                      key={machine.id_machine}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="min-w-[220px]">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {machine.marque} {machine.modele}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {machine.type_machine}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            S/N {machine.numero_serie}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${badgeClass(
                            machine.statut
                          )}`}
                        >
                          {machine.statut}
                        </span>
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {machine.etat}
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {money(machine.tarif_jour)} DA
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {money(machine.tarif_semaine)} DA
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {money(machine.tarif_mois)} DA
                      </td>

                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={route("products.show", machine.id_machine)}
                            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            title="Voir"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            href={route("products.edit", machine.id_machine)}
                            className="p-2 text-blue-500 hover:text-blue-700 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => deleteMachine(machine.id_machine)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paged.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                        Aucune machine trouvée
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
                  className={`rounded-xl px-3 py-2 text-sm font-semibold border ${
                    page <= 1
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
                  className={`rounded-xl px-3 py-2 text-sm font-semibold border ${
                    page <= 1
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
                  className={`rounded-xl px-3 py-2 text-sm font-semibold border ${
                    page >= maxPage
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
                  className={`rounded-xl px-3 py-2 text-sm font-semibold border ${
                    page >= maxPage
                      ? "cursor-not-allowed border-gray-200 dark:border-gray-800 text-gray-400"
                      : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-950"
                  }`}
                >
                  »
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:hidden text-xs text-gray-500 dark:text-gray-400">
            Astuce. Glisse horizontalement pour voir toutes les colonnes.
          </div>
        </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
