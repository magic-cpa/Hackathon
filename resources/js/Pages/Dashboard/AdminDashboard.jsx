import { useState } from 'react';
import AppSidebar from '@/Components/AppSidebar';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from 'lucide-react';

export default function AdminDashboard({ auth }) {
    const [activeView, setActiveView] = useState('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'users':
                return <UserManagement />;
            case 'products':
                return <Link href={route("products.index")}>
                    Products
                </Link>
            case 'settings':
                return <Settings />;
            case 'dashboard':
            default:
                return <DashboardHome />;
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="flex">
                <AppSidebar role="admin" activeView={activeView} setActiveView={setActiveView} />

                <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                    {renderContent()}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}

const DashboardHome = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total Users</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">1,234</p>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total Products</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">567</p>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Pending Requests</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">45</p>
        </div>

        <div className="md:col-span-3 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Activity</h3>
            <ul className="space-y-3">
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    User John Doe registered.
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Cooperative A added a new tractor.
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Alert: High server load detected.
                </li>
            </ul>
        </div>
    </div>
);

const UserManagement = () => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6 text-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">User Management</h3>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Add User
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {[
                            { name: 'Jane Cooper', email: 'jane.cooper@example.com', role: 'Admin', status: 'Active' },
                            { name: 'Cody Fisher', email: 'cody.fisher@example.com', role: 'Cooperative', status: 'Active' },
                            { name: 'Esther Howard', email: 'esther.howard@example.com', role: 'Agriculteur', status: 'Inactive' },
                            { name: 'Jenny Wilson', email: 'jenny.wilson@example.com', role: 'Agriculteur', status: 'Active' },
                        ].map((user, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</a>
                                    <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const ProductManagement = () => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6 text-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Product Management</h3>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Add Product
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-400">Product Image</span>
                        </div>
                        <div className="p-4">
                            <h4 className="font-semibold text-lg mb-2">Tractor Model X{item}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Heavy duty tractor for large scale farming.</p>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-indigo-600">$45,000</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Available</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const Settings = () => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6 text-gray-900 dark:text-gray-100">
            <h3 className="text-lg font-semibold mb-4">System Settings</h3>
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Site Name
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" type="text" defaultValue="AgriLoan" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Maintenance Mode
                    </label>
                    <select className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option>Off</option>
                        <option>On</option>
                    </select>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" type="button">
                    Save Settings
                </button>
            </form>
        </div>
    </div>
);
