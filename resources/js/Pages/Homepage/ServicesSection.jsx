import React from "react";
import { Zap, Users, Calendar, Shield } from "lucide-react";

// Import de l'image depuis ton dossier assets
import bgMain from "../../assets/bgmain.jpg";

const servicesData = [
  {
    icon: <Zap className="w-16 h-16 text-green-500 mx-auto" />,
    title: "Rapidité",
    description:
      "Accédez rapidement au matériel dont vous avez besoin grâce à notre plateforme intuitive.",
  },
  {
    icon: <Users className="w-16 h-16 text-orange-500 mx-auto" />,
    title: "Fiabilité",
    description:
      "Travaillez avec des coopératives fiables et certifiées pour garantir la qualité du matériel.",
  },
  {
    icon: <Calendar className="w-16 h-16 text-blue-500 mx-auto" />,
    title: "Réservation Facile",
    description:
      "Réservez votre matériel en quelques clics et gérez vos locations facilement depuis votre espace personnel.",
  },
  {
    icon: <Shield className="w-16 h-16 text-purple-500 mx-auto" />,
    title: "Sécurité & Transparence",
    description:
      "Tous les contrats et tarifs sont clairs et sécurisés pour une location en toute confiance.",
  },
];

const Services = () => {
  return (
    <section className="relative py-20">
      {/* Image de fond positionnée derrière le contenu */}
      <img
        src={bgMain}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay semi-transparent */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Contenu au-dessus de l'image et de l'overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Pourquoi nous choisir ?</h2>
        <p className="mb-12">
          Nous facilitons la location de matériel agricole avec un service rapide, fiable et transparent.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="bg-white/20 p-8 rounded-xl shadow-lg transform transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
