import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppSidebar from '@/Components/AppSidebar';
import DashboardChart from '@/Components/DashboardChart';

export default function CooperativeDashboard({ auth, stats  }) {
    const [activeView, setActiveView] = useState('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'machines':
                return <MachineManagement />;
            case 'requests':
                return <LoanRequests />;
            case 'settings':
                return <Settings />;
            case 'dashboard':
            default:
                return <DashboardHome stats={stats} chartData={stats?.chartData} />;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}>
            <Head title="Cooperative Dashboard" />

            <div className="flex">
                <AppSidebar role="cooperative" activeView={activeView} setActiveView={setActiveView} />

                <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                    {renderContent()}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}

const DashboardHome = ({ stats, chartData }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Nos Machines</h3>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{stats?.availableMachines || 0}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Réservation en Attente</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats?.pendingReservations || 0}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Revenu Total</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats?.totalRevenue ? `$${stats.totalRevenue}` : '0 DA'}</p>
            </div>
        </div>

        {/* Chart des statistiques */}
        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
            {chartData ? <DashboardChart chartData={chartData} /> : <p className="text-gray-500">Aucune donnée pour le moment</p>}
        </div>
    </>
);

const MachineManagement = () => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold dark:text-white">My Machines</h3>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Add Machine</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="border dark:border-gray-700 rounded-lg p-4">
                    <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-gray-400">Machine Image</div>
                    <h4 className="font-bold dark:text-white text-lg">Tractor Model {i}</h4>
                    <p className="text-gray-500 text-sm">Status: <span className="text-green-500 font-semibold">Available</span></p>
                </div>
            ))}
        </div>
    </div>
);

const LoanRequests = () => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
        <h3 className="text-lg font-semibold dark:text-white mb-4">Loan Requests</h3>
        <table className="w-full text-left dark:text-gray-300">
            <thead>
                <tr className="border-b dark:border-gray-700">
                    <th className="py-2">Farmer</th>
                    <th className="py-2">Machine</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b dark:border-gray-700">
                    <td className="py-3">John Farmer</td>
                    <td>Tractor X1</td>
                    <td>2024-03-20</td>
                    <td><button className="text-indigo-600">Approve</button></td>
                </tr>
            </tbody>
        </table>
    </div>
);

const Settings = () => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-900 dark:text-white">
        <h3 className="text-lg font-semibold mb-4">Cooperative Settings</h3>
        <p>Manage your cooperative profile and preferences here.</p>
    </div>
);
