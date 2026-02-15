import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
    ArrowLeft,
    BadgeCheck,
    CalendarDays,
    Tag,
    Percent,
} from "lucide-react";
import { DayPicker } from "react-day-picker";

/* ================== Helpers ================== */
const safeNum = (v) => {
    const n = Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
};

const percentOff = (base, price) => {
    if (base <= 0) return 0;
    const p = Math.round(((base - price) / base) * 100);
    return p > 0 ? p : 0;
};

const toISODate = (d) => {
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 10);
};

const todayISO = toISODate(new Date());

const parseISODateUTC = (iso) => {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return null;
    return Date.UTC(y, m - 1, d);
};

const daysBetween = (start, end) => {
    const s = parseISODateUTC(start);
    const e = parseISODateUTC(end);
    if (s === null || e === null) return 0;
    const diff = e - s;
    if (diff <= 0) return 0;
    return Math.ceil(diff / 86400000);
};

const expandRangesToSet = (ranges) => {
    const set = new Set();

    for (const r of ranges || []) {
        const s = (r.date_debut || "").slice(0, 10);
        const e = (r.date_fin || "").slice(0, 10);
        if (!s || !e) continue;

        const sT = parseISODateUTC(s);
        const eT = parseISODateUTC(e);
        if (sT === null || eT === null) continue;

        for (let t = sT; t <= eT; t += 86400000) {
            set.add(toISODate(new Date(t)));
        }
    }

    return set;
};

export default function Preview({ machine, reserved = [] }) {
    const { props } = usePage();
    const { flash } = props;
    const user = props?.auth?.user;

    const [activeImage, setActiveImage] = useState(machine.image);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    /* ================== Flash ================== */
    useEffect(() => {
        if (flash?.success) Swal.fire("Succès", flash.success, "success");
        if (flash?.error) Swal.fire("Erreur", flash.error, "error");
    }, [flash]);

    /* ================== Pricing ================== */
    const pricing = useMemo(() => {
        const day = safeNum(machine.tarif_jour);
        const week = safeNum(machine.tarif_semaine);
        const month = safeNum(machine.tarif_mois);
        const weekBase = day * 7;
        const monthBase = day * 30;
        return {
            day,
            week,
            month,
            weekOff: percentOff(weekBase, week),
            monthOff: percentOff(monthBase, month),
        };
    }, [machine]);

    const photos = useMemo(() => {
        const arr = Array.isArray(machine.photos) ? machine.photos : [];
        return [...new Set([machine.image, ...arr])];
    }, [machine]);

    const durationDays = useMemo(() => daysBetween(startDate, endDate), [startDate, endDate]);

    const estimate = useMemo(() => {
        if (!durationDays) return 0;
        return pricing.day * durationDays;
    }, [durationDays, pricing.day]);

    const submitReservation = () => {
        if (!startDate || !endDate) {
            Swal.fire("Attention", "Veuillez sélectionner les dates.", "warning");
            return;
        }

        router.post(route("reservations.store"), {
            id_machine: machine.id_machine,
            date_debut: startDate,
            date_fin: endDate,
            montant: estimate,
        });
    };

    const reservedSet = useMemo(() => expandRangesToSet(reserved), [reserved]);

    const modifiers = useMemo(() => {
        return {
            reserved: (date) => reservedSet.has(toISODate(date)),
            selectedRange: (date) => {
                if (!startDate || !endDate) return false;
                const iso = toISODate(date);
                return iso >= startDate && iso <= endDate;
            },
        };
    }, [reservedSet, startDate, endDate]);

    const modifiersClassNames = {
        reserved: "rdp-reserved",
        selectedRange: "rdp-selectedRange",
    };

    const isCooperateur = user?.roles?.includes("cooperative") || user?.role === "cooperative";

    return (
        <AuthenticatedLayout>
            <Head title={`${machine.marque} ${machine.modele}`} />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50 py-12">
                <div className="mx-auto max-w-7xl px-4">

                    {/* ===== Bouton retour ===== */}
                    <Link
                        href={route("products.index")}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        <ArrowLeft size={16} />
                        Retour aux machines
                    </Link>

                    <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-2">

                        {/* ================= GALERIE ================= */}
                        <div>
                            <div className="overflow-hidden rounded-3xl shadow-xl">
                                <img
                                    src={activeImage}
                                    className="h-[420px] w-full object-cover transition duration-500 hover:scale-105"
                                />
                            </div>

                            {photos.length > 1 && (
                                <div className="mt-6 flex gap-4 overflow-x-auto">
                                    {photos.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(img)}
                                            className={`rounded-2xl overflow-hidden border-2 transition ${activeImage === img
                                                ? "border-green-600 scale-105"
                                                : "border-transparent opacity-70 hover:opacity-100"
                                                }`}
                                        >
                                            <img src={img} className="h-24 w-24 object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ================= CONTENU ================= */}
                        <div className="text-center">

                            <h1 className="text-4xl font-bold text-green-800">{machine.type_machine}</h1>
                            <h2 className="mt-2 text-2xl font-semibold text-gray-800">{machine.marque} {machine.modele}</h2>

                            <div className="mt-4 flex justify-center">
                                <span className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                                    <BadgeCheck size={16} />
                                    {machine.etat}
                                </span>
                            </div>

                            {/* ===== CARTES TARIFS ===== */}
                            <div className="mt-10 grid gap-6 sm:grid-cols-3">
                                <div className="rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
                                    <CalendarDays className="mx-auto text-green-600" />
                                    <div className="mt-3 font-semibold text-gray-600">Tarif journalier</div>
                                    <div className="mt-2 text-2xl font-bold text-green-700">{pricing.day.toFixed(0)} DA</div>
                                </div>
                                <div className="relative rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
                                    {pricing.weekOff > 0 && (
                                        <div className="absolute top-3 right-3 animate-blink rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                                            -{pricing.weekOff}%
                                        </div>
                                    )}
                                    <Tag className="mx-auto text-green-600" />
                                    <div className="mt-3 font-semibold text-gray-600">Tarif hebdomadaire</div>
                                    <div className="mt-2 text-2xl font-bold text-green-700">{pricing.week.toFixed(0)} DA</div>
                                </div>
                                <div className="relative rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
                                    {pricing.monthOff > 0 && (
                                        <div className="absolute top-3 right-3 animate-blink rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                                            -{pricing.monthOff}%
                                        </div>
                                    )}
                                    <Percent className="mx-auto text-green-600" />
                                    <div className="mt-3 font-semibold text-gray-600">Tarif mensuel</div>
                                    <div className="mt-2 text-2xl font-bold text-green-700">{pricing.month.toFixed(0)} DA</div>
                                </div>
                            </div>

                            {/* ===== TABLEAU CARACTÉRISTIQUES ===== */}
                            <div className="mt-12 rounded-3xl bg-white p-6 shadow-lg">
                                <h3 className="mb-4 text-lg font-bold text-green-800">Caractéristiques techniques</h3>
                                <table className="w-full text-sm">
                                    <tbody className="divide-y">
                                        <tr><td className="py-3 font-semibold text-gray-600">Marque</td><td className="py-3">{machine.marque}</td></tr>
                                        <tr><td className="py-3 font-semibold text-gray-600">Modèle</td><td className="py-3">{machine.modele}</td></tr>
                                        <tr><td className="py-3 font-semibold text-gray-600">Type</td><td className="py-3">{machine.type_machine}</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* ===== FORMULAIRE ===== */}
                            {!isCooperateur && (
                                <div className="mt-12 rounded-3xl bg-white p-8 shadow-xl">
                                    <div className="mt-6">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-center">
                                            <div className="rounded-2xl border border-gray-200 bg-white p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <div className="text-sm font-semibold text-gray-700">
                                                        Choisir les dates
                                                    </div>

                                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                                        <span className="h-3 w-3 rounded-full bg-red-500"></span>
                                                        Date réservée (indisponible)
                                                    </div>
                                                </div>

                                                <DayPicker
                                                    mode="range"
                                                    fromDate={new Date()}
                                                    selected={{
                                                        from: startDate ? new Date(startDate) : undefined,
                                                        to: endDate ? new Date(endDate) : undefined,
                                                    }}
                                                    onSelect={(range) => {
                                                        const from = range?.from ? toISODate(range.from) : "";
                                                        const to = range?.to ? toISODate(range.to) : "";
                                                        setStartDate(from || todayISO);
                                                        setEndDate(to || (from || todayISO));
                                                    }}
                                                    disabled={(date) => reservedSet.has(toISODate(date)) || toISODate(date) < todayISO}
                                                    modifiers={modifiers}
                                                    modifiersClassNames={modifiersClassNames}
                                                />
                                            </div>

                                            <div className="w-full sm:w-72">
                                                <div className="grid gap-3">
                                                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                                        <div className="text-xs text-gray-500">Début</div>
                                                        <div className="text-sm font-semibold text-gray-900">{startDate || "-"}</div>
                                                    </div>

                                                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                                        <div className="text-xs text-gray-500">Fin</div>
                                                        <div className="text-sm font-semibold text-gray-900">{endDate || "-"}</div>
                                                    </div>

                                                    {durationDays > 0 && (
                                                        <div className="rounded-2xl bg-green-50 p-4 text-center">
                                                            <div className="text-sm">Durée {durationDays} jours</div>
                                                            <div className="text-lg font-bold text-green-700">
                                                                Montant {estimate.toFixed(0)} DA
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {durationDays > 0 && (
                                        <div className="mt-6 rounded-xl bg-green-50 p-4 text-center">
                                            <div className="text-sm">Durée : {durationDays} jours</div>
                                            <div className="text-lg font-bold text-green-700">Montant estimé : {estimate.toFixed(0)} DA</div>
                                        </div>
                                    )}

                                    <button
                                        onClick={submitReservation}
                                        className="mt-8 w-full rounded-2xl bg-green-600 py-3 text-lg font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-2xl"
                                    >
                                        Confirmer la réservation
                                    </button>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
