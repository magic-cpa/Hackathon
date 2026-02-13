import React from "react";
import heroVideo from "@/assets/hero-video.mp4";
import BlurText from "@/Components/BlurText"; // ton composant BlurText

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden">
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl text-center px-6">
        
        {/* Titre animé */}
        <BlurText
          text="Louez vos machines agricoles facilement"
          className="text-5xl md:text-6xl font-bold mb-6 text-center justify-center"
          animateBy="words"
          direction="top"
          delay={200}
        />

        {/* Sous-texte animé */}
        <BlurText
          text="Accédez à notre large gamme de tracteurs, moissonneuses et équipements agricoles pour vos besoins saisonniers."
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-center justify-center"
          animateBy="words"
          direction="top"
          delay={100}
        />

        
      </div>
    </section>
  );
}
