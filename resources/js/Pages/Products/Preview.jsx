import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useMemo, useState } from "react";

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

const daysBetween = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  if (Number.isNaN(diff)) return 0;
  const d = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return d > 0 ? d : 0;
};

export default function Preview({ machine }) {
  const [activeImage, setActiveImage] = useState(machine.image);
  const [showReserveForm, setShowReserveForm] = useState(false);

  const photos = useMemo(() => {
    const arr = Array.isArray(machine.photos) ? machine.photos : [];
    const uniq = [machine.image, ...arr].filter(Boolean);
    return [...new Set(uniq)];
  }, [machine]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");

  const canReserve = isAvailable(machine.etat);

  const durationDays = useMemo(
    () => daysBetween(startDate, endDate),
    [startDate, endDate]
  );

  const estimate = useMemo(() => {
    if (!durationDays) return null;

    const day = Number(machine.tarif_jour || 0);
    const week = Number(machine.tarif_semaine || 0);
    const month = Number(machine.tarif_mois || 0);

    if (durationDays >= 30 && month > 0) return { label: "Month", amount: month };
    if (durationDays >= 7 && week > 0) return { label: "Week", amount: week };
    return { label: "Day", amount: day * durationDays };
  }, [durationDays, machine]);

  const submitReservation = () => {
    if (!canReserve) return;
    if (!startDate || !endDate) return;

    router.post(route("reservations.store"), {
      id_machine: machine.id_machine,
      date_debut: startDate,
      date_fin: endDate,
      note,
      montant: estimate?.amount ?? null,
      etat_reservation: "En attente",
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
                      className={`shrink-0 overflow-hidden rounded-xl border ${
                        activeImage === url
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
                    {formatDA(machine.tarif_jour)}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Week</div>
                  <div className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatDA(machine.tarif_semaine)}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Month</div>
                  <div className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatDA(machine.tarif_mois)}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                {!showReserveForm ? (
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Reservation
                    </div>

                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Choose your dates and send a request
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowReserveForm(true)}
                      disabled={!canReserve}
                      className={`mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        !canReserve
                          ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                          : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                      }`}
                    >
                      Reserve now
                    </button>

                    {!canReserve && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        This machine is not available
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
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
                        className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                          !startDate || !endDate
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
