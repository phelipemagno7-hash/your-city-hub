import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader, Stars } from "@/components/PageHeader";
import { places } from "@/lib/data";

export const Route = createFileRoute("/agendamentos/")({
  head: () => ({
    meta: [
      { title: "Agendamentos de Beleza e Saúde | Ipa+" },
      {
        name: "description",
        content: "Reserve horário em barbearias, salões, clínicas e estúdios de estética da cidade pelo Ipa+.",
      },
      { property: "og:title", content: "Agendamentos de Beleza e Saúde | Ipa+" },
      { property: "og:description", content: "Escolha o serviço, a data e o horário disponível." },
    ],
  }),
  component: AgendamentosList,
});

function AgendamentosList() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Agendamentos" subtitle="Beleza e saúde" />
      <main className="mx-auto max-w-md space-y-3 px-4 pt-4">
        {places.map((p) => (
          <Link
            key={p.id}
            to="/agendamentos/$placeId"
            params={{ placeId: p.id }}
            className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
          >
            <div className="grid size-20 shrink-0 place-items-center rounded-xl accent-soft text-3xl">{p.emoji}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-bold">{p.name}</p>
                <Stars rating={p.rating} />
              </div>
              <p className="text-xs font-semibold text-primary">{p.type}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" /> {p.address}
              </p>
            </div>
          </Link>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
