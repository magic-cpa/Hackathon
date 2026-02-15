import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";
import AppSidebar from "@/Components/AppSidebar";

export default function AgriculteurDashboard({ auth, myReservations }) {
    const [activeView, setActiveView] = useState("dashboard");

    const { myReservations: pageReservations } = usePage().props || {};
    const reservations = pageReservations ?? myReservations;

    const renderContent = () => {
        switch (activeView) {
            case "browse":
                return <BrowseEquipment />;
            case "reservations":
                return <MyReservations reservations={reservations} />;
            case "settings":
                return <Settings />;
            default:
                return (
                    <DashboardHome
                        reservations={reservations}
                        onBrowse={() => setActiveView("browse")}
                        onGoReservations={() => setActiveView("reservations")}
                    />
                );
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Agriculteur Dashboard" />

            <div className="flex">
                <AppSidebar
                    role="agriculteur"
                    activeView={activeView}
                    setActiveView={setActiveView}
                />

                <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                    {renderContent()}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}

const fmt = (iso) => {
    if (!iso) return "-";
    const [y, m, d] = String(iso).slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
};

const statusBadge = (etat) => {
    const s = String(etat || "").toLowerCase();
    if (s.includes("attente")) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (s.includes("valid") || s.includes("accept")) return "bg-green-100 text-green-700 border-green-200";
    if (s.includes("refus")) return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
};

const DashboardHome = ({ reservations, onBrowse, onGoReservations }) => {
  const data = reservations?.data ?? [];

  const active = useMemo(() => {
    return data.filter((r) => {
      const s = String(r.etat_reservation || "").toLowerCase();
      return !s.includes("refus");
    }).length;
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">
            Réservations actives
          </h3>
          <p className="text-4xl font-bold text-indigo-600 mt-2 text-center">
            {active}
          </p>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={onGoReservations}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              Voir mes réservations
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">
            Total
          </h3>
          <p className="text-4xl font-bold text-green-600 mt-2 text-center">
            {reservations?.total ?? data.length}
          </p>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={onBrowse}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Parc matériel
            </button>
          </div>
        </div>
      </div>

      <MyReservations reservations={reservations} />

      <BrowseEquipment />
    </div>
  );
};

const MyReservations = ({ reservations }) => {
    const data = reservations?.data ?? [];

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold dark:text-white">
                    Mes réservations
                </h3>

                <div className="text-sm text-gray-500 dark:text-gray-300">
                    {reservations?.total ?? data.length} demande(s)
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 dark:border-gray-700">
                        <tr className="text-gray-500 dark:text-gray-300">
                            <th className="py-3 pr-4">Machine</th>
                            <th className="py-3 pr-4">Période</th>
                            <th className="py-3 pr-4">Paiement</th>
                            <th className="py-3 pr-4">Montant</th>
                            <th className="py-3 text-right">Statut</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((r) => (
                            <tr key={r.id_reservation} className="text-gray-800 dark:text-gray-100">
                                <td className="py-3 pr-4">
                                    <div className="font-semibold">
                                        {r.machine?.marque} {r.machine?.modele}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-300">
                                        {r.machine?.type_machine || ""}
                                    </div>
                                </td>

                                <td className="py-3 pr-4">
                                    {fmt(r.date_debut)} → {fmt(r.date_fin)}
                                </td>

                                <td className="py-3 pr-4">
                                    {r.mode_paiement || "-"}
                                </td>

                                <td className="py-3 pr-4">
                                    {Number(r.montant || 0).toLocaleString()} DA
                                </td>

                                <td className="py-3 text-right">
                                    <span
                                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold ${statusBadge(
                                            r.etat_reservation
                                        )}`}
                                    >
                                        {r.etat_reservation}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-10 text-center text-gray-500">
                                    Aucune réservation
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {!!reservations?.links?.length && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {reservations.links.map((l, i) => (
                        <button
                            key={i}
                            type="button"
                            disabled={!l.url}
                            onClick={() => l.url && router.visit(l.url, { preserveScroll: true })}
                            className={[
                                "rounded-lg border px-3 py-2 text-sm",
                                l.active
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200",
                                !l.url
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700",
                            ].join(" ")}
                            dangerouslySetInnerHTML={{ __html: l.label }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const BrowseEquipment = () => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
        <h3 className="text-lg font-semibold dark:text-white mb-4">Parc matériel</h3>
        <div className="text-sm text-gray-500 dark:text-gray-300">
            Branche ici ta page browse.
        </div>
    </div>
);

const Settings = () => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-900 dark:text-white">
        <h3 className="text-lg font-semibold mb-4">Paramètres</h3>
        <div className="text-sm text-gray-500 dark:text-gray-300">
            Branche ici tes paramètres.
        </div>
    </div>
);
