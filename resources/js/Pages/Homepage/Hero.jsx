import heroVideo from "@/assets/hero-video.mp4";
import { Link } from "@inertiajs/react";
import { ArrowRight, Tractor, ShieldCheck, CalendarCheck } from "lucide-react";
import BlurText from "@/Components/BlurText";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.18),transparent_60%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Plateforme location matériel agricole
          </div>

          <BlurText
            text="Louez vos machines agricoles facilement"
            className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
            animateBy="words"
            direction="top"
            delay={160}
          />

          <BlurText
            text="Accédez à des tracteurs, moissonneuses et équipements agricoles. Réservez en ligne. Paiement simple. Suivi clair."
            className="mt-6 text-base md:text-xl text-white/85 max-w-2xl mx-auto"
            animateBy="words"
            direction="top"
            delay={90}
          />

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={route("products.index")}
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-3 text-sm md:text-base font-semibold shadow-lg shadow-green-600/20 transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Parcourir les machines
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>

            <Link
              href={route("register")}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm md:text-base font-semibold text-white backdrop-blur transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              Créer un compte
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-white/90">
                <Tractor className="h-4 w-4 text-green-300" />
                <span className="text-sm font-semibold">Large choix</span>
              </div>
              <div className="mt-2 text-xs text-white/75">
                Filtrez par type, marque, modèle, disponibilité.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-white/90">
                <CalendarCheck className="h-4 w-4 text-green-300" />
                <span className="text-sm font-semibold">Réservation rapide</span>
              </div>
              <div className="mt-2 text-xs text-white/75">
                Choisissez vos dates. Le calendrier bloque les jours réservés.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-white/90">
                <ShieldCheck className="h-4 w-4 text-green-300" />
                <span className="text-sm font-semibold">Confiance</span>
              </div>
              <div className="mt-2 text-xs text-white/75">
                Suivi des demandes. Statuts clairs. Notifications.
              </div>
            </div>
          </div>

          <div className="mt-10 text-xs text-white/60">
            Astuce. Utilisez la recherche pour trouver une machine en 5 secondes.
          </div>
        </div>
      </div>
    </section>
  );
}
