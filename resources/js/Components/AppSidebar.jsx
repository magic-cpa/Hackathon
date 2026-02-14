import { Link, usePage } from "@inertiajs/react";

const menus = {
    admin: [
        { href: route("dashboard"), label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { href: route("products.index"), label: "Product Management", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    ],
    cooperative: [
        { href: route("dashboard"), label: "Accueil", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { href: route("products.table"), label: "Machines", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
        { href: route("cooperative.reservations.index"), label: "Réservations", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
        { href: route("products.index"), label: "Catalogue équipements", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
        { href: route("profile.edit"), label: "Paramètres", icon: "M11.983 13.017a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM19.4 15a7.97 7.97 0 00.06-2l2.11-1.65a.8.8 0 00.19-1.02l-2-3.46a.8.8 0 00-.96-.36l-2.49 1a8.1 8.1 0 00-1.73-1l-.38-2.65A.8.8 0 0013.42 2h-4a.8.8 0 00-.79.67l-.38 2.65a8.1 8.1 0 00-1.73 1l-2.49-1a.8.8 0 00-.96.36l-2 3.46a.8.8 0 00.19 1.02L3.37 13a7.97 7.97 0 00.06 2L1.32 16.65a.8.8 0 00-.19 1.02l2 3.46a.8.8 0 00.96.36l2.49-1c.54.42 1.12.77 1.73 1l.38 2.65a.8.8 0 00.79.67h4a.8.8 0 00.79-.67l.38-2.65c.61-.23 1.19-.58 1.73-1l2.49 1a.8.8 0 00.96-.36l2-3.46a.8.8 0 00-.19-1.02L19.4 15z" },
    ],
    agriculteur: [
        { href: route("dashboard"), label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { href: route("products.index"), label: "Browse Equipment", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    ],
};

const roleTitle = (role) => {
    if (role === "admin") return "Admin";
    if (role === "cooperative") return "Coopérative";
    if (role === "agriculteur") return "Agriculteur";
    return "Menu";
};

const SidebarItem = ({ item, active }) => (
    <Link
        href={item.href}
        className={[
            "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            active
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white",
        ].join(" ")}
    >
        <span
            className={[
                "grid h-9 w-9 place-items-center rounded-xl border",
                active
                    ? "border-indigo-200 bg-white text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300"
                    : "border-gray-200 bg-white text-gray-500 group-hover:text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:group-hover:text-white",
            ].join(" ")}
        >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
        </span>

        <span className="truncate">{item.label}</span>

        {active && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-indigo-500" />}
    </Link>
);

export default function AppSidebar({ role }) {
    const navItems = menus[role] || menus.agriculteur;
    const { url } = usePage();

    const isActive = (href) => {
        try {
            const path = new URL(href, window.location.origin).pathname;
            return url === path || url.startsWith(path + "/");
        } catch {
            return false;
        }
    };

    return (
        <aside className="hidden min-h-screen w-72 border-r border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900 md:block">
            <div className="flex h-full flex-col">
                <div className="p-5">
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm dark:border-white/10 dark:from-white/5 dark:to-white/[0.02]">

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7" />
                                </svg>
                            </div>

                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Espace
                                </div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                    {roleTitle(role)}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="px-5">
                    <div className="h-px bg-gray-200 dark:bg-white/10" />
                </div>

                <nav className="flex-1 p-5">
                    <div className="flex flex-col gap-1.5">
                        {navItems.map((item) => (
                            <SidebarItem key={item.href} item={item} active={isActive(item.href)} />
                        ))}
                    </div>
                </nav>
            </div>
        </aside>
    );
}
