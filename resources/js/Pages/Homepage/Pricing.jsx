// resources/js/Components/Pricing.jsx
import React from "react";
import { Phone, MessageCircle, CalendarDays, BadgePercent, ShieldCheck } from "lucide-react";

const Pricing = () => {
  const phoneDisplay = "0553 41 74 85";
  const phoneDial = "0553417485";
  const wa = `https://wa.me/213${phoneDial.replace(/^0/, "")}`;

  const Card = ({ title, subtitle, hint, icon, highlight }) => (
    <div
      className={[
        "relative overflow-hidden rounded-3xl border bg-white p-7 shadow-sm transition",
        "hover:-translate-y-1 hover:shadow-xl",
        highlight ? "border-green-200 ring-1 ring-green-100" : "border-gray-200",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          <div className="mt-2 text-lg font-bold text-gray-900">{subtitle}</div>
        </div>

        <div
          className={[
            "flex h-11 w-11 items-center justify-center rounded-2xl border",
            highlight ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50",
          ].join(" ")}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">{hint}</div>

      <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="h-4 w-4" />
        Réponse rapide
      </div>

      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-gray-100" />
    </div>
  );

  return (
    <section className="bg-gradient-to-b from-white to-green-50/40 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
            <BadgePercent className="h-4 w-4" />
            Tarification flexible
          </div>

          <h2 className="mt-5 text-3xl font-extrabold text-gray-900">
            Tarification
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Prix selon la machine, la durée, et la disponibilité. Demandez un devis avec vos dates.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card
            title="Journée"
            subtitle="Devis par téléphone"
            hint="Idéal pour un besoin court. Donnez le type de machine et vos dates."
            icon={<CalendarDays className="h-5 w-5 text-green-700" />}
          />

          <Card
            title="Semaine"
            subtitle="Remise possible"
            hint="Réduction selon disponibilité et période. Devis rapide."
            icon={<BadgePercent className="h-5 w-5 text-green-700" />}
            highlight
          />

          <Card
            title="Mois"
            subtitle="Offre selon durée"
            hint="Meilleur coût sur longue période. Devis selon saison."
            icon={<CalendarDays className="h-5 w-5 text-green-700" />}
          />
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            <div className="md:col-span-2 p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
                  <Phone className="h-5 w-5 text-gray-800" />
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    Contact pour un devis
                  </div>
                  <div className="mt-1 text-lg font-bold text-gray-900">
                    {phoneDisplay}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Envoyez
                    <span className="font-semibold text-gray-900"> type de machine</span>
                    , dates, commune, et durée.
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                  Type de machine
                </span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                  Dates
                </span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                  Wilaya
                </span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                  Durée
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 md:border-t-0 md:border-l p-7">
              <div className="grid gap-3">
                <a
                  href={`tel:${phoneDial}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <Phone className="h-4 w-4" />
                  Appeler
                </a>

                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>

                <div className="mt-2 text-center text-xs text-gray-500">
                  Temps de réponse selon disponibilité
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;
