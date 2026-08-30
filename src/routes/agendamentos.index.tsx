import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, CalendarDays, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { Stars } from "@/components/PageHeader";
import { places } from "@/lib/data";

export const Route = createFileRoute("/agendamentos/")({
  head: () => ({
    meta: [
      { title: "Agendamentos de Beleza e Saúde em Ipanema | Ipa+" },
      {
        name: "description",
        content: "Reserve horário em barbearias, salões, clínicas odontológicas e estúdios de estética da cidade pelo Ipa+.",
      },
      { property: "og:title", content: "Agendamentos de Beleza e Saúde em Ipanema | Ipa+" },
      { property: "og:description", content: "Escolha o serviço, a data e o horário disponível em estabelecimentos locais." },
    ],
  }),
  component: AgendamentosList,
});

function AgendamentosList() {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
              <CalendarDays className="size-7 text-primary" /> Agendamentos & Estética
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Reserve seu horário sem filas em barbearias, salões e clínicas de Ipanema
            </p>
          </div>
        </div>

        {/* Grid of Establishments */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {places.map((p) => (
            <Link
              key={p.id}
              to="/agendamentos/$placeId"
              params={{ placeId: p.id }}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-4">
                  <div className="grid size-16 shrink-0 place-items-center rounded-2xl accent-soft text-4xl group-hover:scale-105 transition-transform duration-300 shadow-sm">
                    {p.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                      {p.name}
                    </h2>
                    <p className="text-xs font-bold text-primary">{p.type}</p>
                    <div className="mt-1">
                      <Stars rating={p.rating} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{p.address}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>{p.services.length}</strong> serviços disponíveis para agendamento online
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                <span>Escolher serviço e data</span>
                <ArrowRight className="size-4" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
