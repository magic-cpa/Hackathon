import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppSidebar from '@/Components/AppSidebar';

export default function AgriculteurDashboard({ auth }) {
    const [activeView, setActiveView] = useState('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'browse':
                return <BrowseEquipment />;
            case 'reservations':
                return <MyReservations />;
            case 'settings':
                return <Settings />;
            case 'dashboard':
            default:
                return <DashboardHome />;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Agriculteur Dashboard
                </h2>
            }
        >
            <Head title="Agriculteur Dashboard" />

            <div className="flex">
                <AppSidebar role="agriculteur" activeView={activeView} setActiveView={setActiveView} />

                <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                    {renderContent()}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}

const DashboardHome = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Active Reservations</h3>
            <p className="text-4xl font-bold text-indigo-600 mt-2 text-center">2</p>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Machines Borrowed</h3>
            <p className="text-4xl font-bold text-green-600 mt-2 text-center">5</p>
        </div>
    </div>
);

const BrowseEquipment = () => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
        <h3 className="text-lg font-semibold dark:text-white mb-6">Browse Available Equipment</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="border dark:border-gray-700 rounded-lg p-4 flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400">Photo</div>
                    <div>
                        <h4 className="font-bold dark:text-white">Professional Tractor {i}</h4>
                        <p className="text-gray-500 text-sm mb-2">Owner: Coop {i}</p>
                        <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Rent Now</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const MyReservations = () => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
        <h3 className="text-lg font-semibold dark:text-white mb-4">My Reservations</h3>
        <div className="space-y-4">
            <div className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-center">
                <div>
                   <p className="font-bold dark:text-white">Tractor X100</p>
                   <p className="text-gray-500 text-sm">Pick up: March 25, 2024</p>
                </div>
                <span className="text-yellow-500 font-semibold">Pending</span>
            </div>
        </div>
    </div>
);

const Settings = () => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-900 dark:text-white">
        <h3 className="text-lg font-semibold mb-4">Farmer Proifle Settings</h3>
        <p>Manage your farming details and account settings.</p>
    </div>
);
