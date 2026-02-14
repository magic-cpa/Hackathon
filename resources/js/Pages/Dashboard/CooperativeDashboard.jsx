import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppSidebar from '@/Components/AppSidebar';
import DashboardChart from '@/Components/DashboardChart';
import { Link } from 'lucide-react';

export default function CooperativeDashboard({ auth, stats, latestReservations = [] }) {
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "machines":
        return <MachineManagement />;
      case "requests":
        return <LoanRequests />;
      case "settings":
        return <Settings />;
      case "dashboard":
      default:
        return (
          <DashboardHome
            stats={stats}
            chartData={stats?.chartData}
            latestReservations={latestReservations}
          />
        );
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Cooperative Dashboard" />

      <div className="flex">
        <AppSidebar role="cooperative" activeView={activeView} setActiveView={setActiveView} />

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">{renderContent()}</main>
      </div>
    </AuthenticatedLayout>
  );
}

const DashboardHome = ({ stats, chartData, latestReservations }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Nos Machines</h3>
        <p className="text-3xl font-bold text-indigo-600 mt-2">{stats?.availableMachines || 0}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Réservations en attente</h3>
        <p className="text-3xl font-bold text-yellow-600 mt-2">{stats?.pendingReservations || 0}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Revenu total</h3>
        <p className="text-3xl font-bold text-green-600 mt-2">{stats?.totalRevenue ? `${stats.totalRevenue} DA` : "0 DA"}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
        {chartData ? <DashboardChart chartData={chartData} /> : <p className="text-gray-500">Aucune donnée</p>}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Dernières réservations</h3>
          <Link
            href={route("cooperative.reservations.index")}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Voir tout
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm dark:text-gray-300">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <th className="py-2 pr-2">Agriculteur</th>
                <th className="py-2 pr-2">Machine</th>
                <th className="py-2 pr-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {latestReservations?.length ? (
                latestReservations.map((r) => (
                  <tr key={r.id_reservation} className="border-b border-gray-100 dark:border-gray-700/60">
                    <td className="py-2 pr-2 whitespace-nowrap">{r.agriculteur?.name || "-"}</td>
                    <td className="py-2 pr-2 whitespace-nowrap">
                      {r.machine ? `${r.machine.marque} ${r.machine.modele}` : "-"}
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap">
                      <span className="rounded-full px-2 py-1 text-[11px] font-semibold bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200">
                        {r.etat_reservation || "En attente"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-sm text-gray-500">
                    Aucune réservation
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>
);
