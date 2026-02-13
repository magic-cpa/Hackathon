import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";

export default function MachinesGrid() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupération des machines depuis l'API Laravel
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/machines")
      .then((res) => {
        // Trier par date de création décroissante et prendre les 10 derniers
        const lastMachines = res.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10);

        setMachines(lastMachines);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-700 text-lg font-semibold">
          Chargement des machines...
        </p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white-50 ">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Nos Machines Agricoles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-fr">
          {machines.map((machine) => (
            <div
              key={machine.id_machine}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
              {/* IMAGE */}
              <Link href={`/machines/${machine.id_machine}`}>
                <div className="w-full h-48 overflow-hidden rounded-t-xl">
                  <img
                    src={machine.photos?.[0]?.url || "/placeholder-machine.jpg"}
                    alt={`${machine.marque} ${machine.modele}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              </Link>

              {/* CONTENU */}
              <div className="flex flex-col flex-grow p-4 text-center">
                <h3 className="text-lg font-bold">
                  {machine.marque} {machine.modele}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  N° Série : {machine.numero_serie || "N/A"}
                </p>

                <div className="flex-grow"></div>

                {/* BOUTON LOUER */}
                <div className="mt-4">
                  <button
                    className="relative w-4/5 mx-auto rounded-full bg-blue-500 px-6 py-3 font-mono font-bold text-white
                               transition-colors duration-300 ease-linear
                               before:absolute before:right-1/2 before:top-1/2 before:-z-[1] 
                               before:h-3/4 before:w-2/3 before:origin-bottom-left 
                               before:-translate-y-1/2 before:translate-x-1/2 before:animate-ping 
                               before:rounded-full before:bg-blue-500 hover:bg-blue-700 hover:before:bg-blue-700"
                  >
                    Louer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
