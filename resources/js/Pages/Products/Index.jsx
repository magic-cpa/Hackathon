import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useMemo, useState } from "react";

const formatDA = (v) => {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return "0 DA";
    return `${n.toLocaleString()} DA`;
};

const statusStyles = (etat) => {
    if (etat === "Disponible") return "bg-green-600 text-white";
    if (etat === "Maintenance") return "bg-amber-500 text-white";
    return "bg-gray-700 text-white";
};

export default function ProductsIndex({ machines = [] }) {
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("newest");

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();

        let list = machines.filter((m) => {
            const hay = `${m.type_machine} ${m.marque} ${m.modele} ${m.etat}`.toLowerCase();

            const matchText = query.length === 0 || hay.includes(query);
            const matchStatus = status === "all" || (m.etat || "").toLowerCase() === status;

            return matchText && matchStatus;
        });

        if (sort === "newest") {
            list = list.slice().sort((a, b) => Number(b.id_machine) - Number(a.id_machine));
        }

        if (sort === "price_day_asc") {
            list = list
                .slice()
                .sort((a, b) => Number(a.tarif_jour || 0) - Number(b.tarif_jour || 0));
        }

        if (sort === "price_day_desc") {
            list = list
                .slice()
                .sort((a, b) => Number(b.tarif_jour || 0) - Number(a.tarif_jour || 0));
        }

        return list;
    }, [machines, q, status, sort]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Agricultural Machines
                    </h2>

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {filtered.length} shown
                        <span className="mx-1">/</span>
                        {machines.length} total
                    </div>
                </div>
            }
        >
            <Head title="Products" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                            <div className="md:col-span-7">
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search type, brand, model, status"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 outline-none ring-0 focus:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-700"
                                />
                            </div>

                            <div className="md:col-span-3">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-700"
                                >
                                    <option value="all">All status</option>
                                    <option value="disponible">Disponible</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-700"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price_day_asc">Day price low</option>
                                    <option value="price_day_desc">Day price high</option>
                                </select>
                            </div>
                        </div>

                        {(q.trim() || status !== "all") && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => {
                                        setQ("");
                                        setStatus("all");
                                        setSort("newest");
                                    }}
                                    className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-950"
                                >
                                    Clear
                                </button>

                                {q.trim() && (
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                                        {q.trim()}
                                    </span>
                                )}

                                {status !== "all" && (
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                                        {status}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
                            <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                No products match your search
                            </div>
                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Try fewer words or reset filters
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((m) => (
                                <div
                                    key={m.id_machine}
                                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        <img
                                            src={m.image}
                                            alt={`${m.type_machine} ${m.marque} ${m.modele}`}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                            loading="lazy"
                                        />

                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-90" />

                                        <div className="absolute left-3 top-3">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles(
                                                    m.etat
                                                )}`}
                                            >
                                                {m.etat}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-3 left-3 right-3">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-900">
                                                    {m.type_machine}
                                                </span>
                                                <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-900">
                                                    {m.marque}
                                                </span>
                                            </div>

                                            <div className="mt-2 line-clamp-1 text-sm font-semibold text-white">
                                                {m.modele}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="line-clamp-1 text-base font-semibold text-gray-900 dark:text-gray-100">
                                                    {m.marque} {m.modele}
                                                </div>
                                                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    {m.type_machine}
                                                </div>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Day
                                                </div>
                                                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {formatDA(m.tarif_jour)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Week
                                                </div>
                                                <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {formatDA(m.tarif_semaine)}
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Month
                                                </div>
                                                <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {formatDA(m.tarif_mois)}
                                                </div>
                                            </div>
                                        </div>

                                        {Array.isArray(m.photos) && m.photos.length > 1 && (
                                            <div className="mt-4">
                                                <div className="flex gap-2 overflow-x-auto pb-1">
                                                    {m.photos.slice(0, 6).map((url, i) => (
                                                        <img
                                                            key={`${m.id_machine}-${i}`}
                                                            src={url}
                                                            alt=""
                                                            className="h-12 w-12 flex-none rounded-lg object-cover ring-1 ring-black/5 dark:ring-white/10"
                                                            loading="lazy"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-5">
                                            <Link
                                                href={route("products.show", m.id_machine)}
                                                className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                                            >
                                                View Details
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
