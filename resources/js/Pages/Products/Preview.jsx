import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useMemo, useState } from "react";
import Swal from 'sweetalert2';



const safeNum = (v) => {
    const n = Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
};

const percentOff = (base, price) => {
    if (base <= 0) return 0;
    const p = Math.round(((base - price) / base) * 100);
    return p > 0 ? p : 0;
};

const formatDA = (v) => {
    const n = Number(v || 0);
    if (Number.isNaN(n)) return "0 DA";
    return `${n.toLocaleString()} DA`;
};

const statusBadge = (etat) => {
    if (etat === "Disponible") return "bg-green-600 text-white";
    if (etat === "Maintenance") return "bg-amber-500 text-white";
    return "bg-gray-700 text-white";
};

const isAvailable = (etat) => (etat || "").toLowerCase() === "disponible";

const toLocalMidnight = (ymd) => {
    if (!ymd) return null;
    const [y, m, d] = ymd.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
};

const daysBetween = (start, end) => {
    const s = toLocalMidnight(start);
    const e = toLocalMidnight(end);
    if (!s || !e) return 0;

    const diff = e.getTime() - s.getTime();
    if (diff <= 0) return 0;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default function Preview({ machine }) {
    const { props } = usePage();
    const { flash } = props;
    const user = props?.auth?.user;

    useEffect(() => {
        if (flash?.error) {
            Swal.fire({
                title: 'Accès Refusé',
                text: flash.error,
                icon: 'error',
                confirmButtonColor: '#4f46e5'
            });
        }
        if (flash?.success) {
            setShowReserveForm(false);
            Swal.fire({
                title: 'Succès !',
                text: flash.success,
                icon: 'success',
                confirmButtonColor: '#4f46e5'
            });
        }
    }, [flash]);

    const [activeImage, setActiveImage] = useState(machine.image);
    const [showReserveForm, setShowReserveForm] = useState(false);

    const isAgriculteur =
        user?.roles?.includes?.("agriculteur") || user?.role === "agriculteur";
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [note, setNote] = useState("");

    const pricing = useMemo(() => {
        const day = safeNum(machine.tarif_jour);
        const week = safeNum(machine.tarif_semaine);
        const month = safeNum(machine.tarif_mois);

        const weekBase = day * 7;
        const monthBase = day * 30;

        const weekSave = Math.max(0, weekBase - week);
        const monthSave = Math.max(0, monthBase - month);

        const weekPerDay = week > 0 ? week / 7 : 0;
        const monthPerDay = month > 0 ? month / 30 : 0;

        return {
            day,
            week,
            month,
            weekBase,
            monthBase,
            weekSave,
            monthSave,
            weekPerDay,
            monthPerDay,
            weekOff: percentOff(weekBase, week),
            monthOff: percentOff(monthBase, month),
        };
    }, [machine.tarif_jour, machine.tarif_semaine, machine.tarif_mois]);

    const photos = useMemo(() => {
        const arr = Array.isArray(machine.photos) ? machine.photos : [];
        const uniq = [machine.image, ...arr].filter(Boolean);
        return [...new Set(uniq)];
    }, [machine]);


    const canReserve = isAvailable(machine.etat);

    const canOpenReservation = isAgriculteur && canReserve;


    const durationDays = useMemo(
        () => daysBetween(startDate, endDate),
        [startDate, endDate]
    );

    const estimate = useMemo(() => {
        if (!durationDays) return null;

        const day = safeNum(machine.tarif_jour);
        const week = safeNum(machine.tarif_semaine);
        const month = safeNum(machine.tarif_mois);

        if (durationDays >= 30 && month > 0) return { label: "Month", amount: month };
        if (durationDays >= 7 && week > 0) return { label: "Week", amount: week };
        return { label: "Day", amount: day * durationDays };
    }, [durationDays, machine.tarif_jour, machine.tarif_semaine, machine.tarif_mois]);

    const submitReservation = () => {
        if (!isAgriculteur) {
            Swal.fire({
                title: "Accès Refusé",
                text: "Only agriculteurs can reserve machines",
                icon: "error",
                confirmButtonColor: "#4f46e5",
            });
            return;
        }

        if (!startDate || !endDate) {
            Swal.fire({
                title: "Dates manquantes",
                text: "Veuillez sélectionner les dates de début et de fin.",
                icon: "warning",
                confirmButtonColor: "#4f46e5",
            });
            return;
        }

        Swal.fire({
            title: "Confirmer la réservation ?",
            text: `Vous allez réserver ce matériel du ${startDate} au ${endDate}.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4f46e5",
            cancelButtonColor: "#ef4444",
            confirmButtonText: "Oui, réserver !",
            cancelButtonText: "Annuler",
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route("reservations.store"), {
                    id_machine: machine.id_machine,
                    date_debut: startDate,
                    date_fin: endDate,
                    note,
                    montant: estimate?.amount ?? null,
                    etat_reservation: "En attente",
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${machine.marque} ${machine.modele}`} />

            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            href={route("products.index")}
                            className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-950"
                        >
                            ← Back
                        </Link>

                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                                machine.etat
                            )}`}
                        >
                            {machine.etat}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                        <div>
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
                                <div className="aspect-[4/3] w-full bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={activeImage}
                                        alt={`${machine.type_machine} ${machine.marque} ${machine.modele}`}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {photos.length > 1 && (
                                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                                    {photos.map((url, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setActiveImage(url)}
                                            className={`shrink-0 overflow-hidden rounded-xl border ${activeImage === url
                                                ? "border-gray-900 dark:border-white"
                                                : "border-gray-200 dark:border-gray-800"
                                                }`}
                                        >
                                            <img src={url} alt="" className="h-20 w-20 object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                {machine.type_machine}
                            </div>

                            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {machine.marque} {machine.modele}
                            </h1>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Day</div>
                                    <div className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {formatDA(pricing.day)}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Per day</div>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Week</div>

                                        {pricing.weekOff > 0 && (
                                            <span className="rounded-full bg-green-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                                                -{pricing.weekOff}%
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {formatDA(pricing.weekPerDay)}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Per day</div>

                                    {pricing.weekSave > 0 && (
                                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            Save {formatDA(pricing.weekSave)} vs {formatDA(pricing.weekBase)}
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Month</div>

                                        {pricing.monthOff > 0 && (
                                            <span className="rounded-full bg-green-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                                                -{pricing.monthOff}%
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {formatDA(pricing.monthPerDay)}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Per day</div>

                                    {pricing.monthSave > 0 && (
                                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            Save {formatDA(pricing.monthSave)} vs {formatDA(pricing.monthBase)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                                {!isAgriculteur && (
                                    <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-950 dark:text-gray-200">
                                        Only agriculteurs can reserve machines
                                    </div>
                                )}

                                {!showReserveForm ? (
                                    <div className="mt-3">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            Reservation
                                        </div>

                                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Choose your dates and send a request
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowReserveForm(true)}
                                            disabled={!isAgriculteur}
                                            className={`mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${!isAgriculteur
                                                ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                                : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                                                }`}
                                        >
                                            Reserve now
                                        </button>

                                        {/* {!machineAvailable && (
                                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                This machine is not available
                                            </div>
                                        )} */}
                                    </div>
                                ) : (
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                Make a reservation
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setShowReserveForm(false)}
                                                className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-950"
                                            >
                                                Close
                                            </button>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div>
                                                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                                    Start date
                                                </div>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-700"
                                                />
                                            </div>

                                            <div>
                                                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                                    End date
                                                </div>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-700"
                                                />
                                            </div>
                                        </div>

                                        {estimate && (
                                            <div className="mt-3 rounded-2xl bg-gray-50 p-4 dark:bg-gray-950">
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Estimate
                                                </div>
                                                <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {estimate.label} total {formatDA(estimate.amount)}
                                                </div>
                                                {durationDays > 0 && (
                                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        {durationDays} day(s)
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="mt-3">
                                            <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                                Note
                                            </div>
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                rows={3}
                                                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-700"
                                                placeholder="Example I need delivery to my farm"
                                            />
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={submitReservation}
                                                disabled={!startDate || !endDate}
                                                className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${!startDate || !endDate
                                                    ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                                    : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                                                    }`}
                                            >
                                                Confirm reservation
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStartDate("");
                                                    setEndDate("");
                                                    setNote("");
                                                }}
                                                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-950"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                                Machine id {machine.id_machine}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
