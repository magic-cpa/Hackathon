import { Link } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export default function MachinesGrid() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);

    const perView = 4;
    const [current, setCurrent] = useState(0);

    const maxIndex = useMemo(() => {
        if (!machines.length) return 0;
        return Math.max(0, machines.length - perView);
    }, [machines.length]);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/machines")
            .then((res) => {
                setMachines(res.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!machines.length) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, [machines.length, maxIndex]);

    useEffect(() => {
        if (current > maxIndex) setCurrent(0);
    }, [current, maxIndex]);

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
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold mb-12 text-center">
                    Nos Machines Agricoles
                </h2>

                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-1000 ease-in-out"
                        style={{
                            transform: `translateX(-${current * (100 / perView)}%)`,
                        }}
                    >
                        {machines.map((machine) => (
                            <div
                                key={machine.id_machine}
                                className="w-1/2 md:w-1/3 lg:w-1/4 shrink-0 px-3"
                            >
                                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col h-full">
                                    <Link href={`/machines/${machine.id_machine}`}>
                                        <div className="w-full h-48 overflow-hidden rounded-t-xl">
                                            <img
                                                src={machine.image || "/placeholder-machine.jpg"}
                                                alt={`${machine.marque} ${machine.modele}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </Link>

                                    <div className="p-4 text-center flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold">
                                            {machine.marque} {machine.modele}
                                        </h3>

                                        <p className="text-gray-500 text-sm mt-1">
                                            N° Série : {machine.numero_serie || "N/A"}
                                        </p>

                                        <div className="flex-grow" />

                                        <button className="mt-4 w-4/5 mx-auto rounded-full bg-blue-500 px-6 py-3 font-bold text-white hover:bg-blue-700 transition">
                                            Louer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {maxIndex > 0 && (
                    <div className="flex justify-center mt-6 gap-2">
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`h-3 w-3 rounded-full ${
                                    current === i ? "bg-blue-600" : "bg-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
