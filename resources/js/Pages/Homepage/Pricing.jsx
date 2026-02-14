// resources/js/Components/Pricing.jsx
import React from "react";

const Pricing = () => {
    const phoneDisplay = "0553 41 74 85";
    const phoneDial = "0553417485";

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Tarification
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Prix selon la machine, la durée, et la disponibilité
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-2xl border border-gray-200 p-6 bg-white">
                        <div className="text-sm font-semibold text-gray-900">
                            Journée
                        </div>
                        <div className="mt-3 text-gray-700">
                            Demandez le prix par téléphone
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            Réponse rapide
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-6 bg-white">
                        <div className="text-sm font-semibold text-gray-900">
                            Semaine
                        </div>
                        <div className="mt-3 text-gray-700">
                            Remise selon disponibilité
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            Prix par téléphone
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-6 bg-white">
                        <div className="text-sm font-semibold text-gray-900">
                            Mois
                        </div>
                        <div className="mt-3 text-gray-700">
                            Offre selon durée
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            Prix par téléphone
                        </div>
                    </div>
                </div>

                <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <div className="text-sm font-semibold text-gray-900">
                                Contact pour un devis
                            </div>
                            <div className="mt-1 text-gray-700">
                                Téléphone {phoneDisplay}
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Donnez le type de machine et les dates
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <a
                                href={`tel:${phoneDial}`}
                                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
                            >
                                Appeler
                            </a>

                            <a
                                href={`https://wa.me/213${phoneDial.replace(/^0/, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
