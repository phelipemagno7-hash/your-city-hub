import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Check, Clock, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader, Stars } from "@/components/PageHeader";
import { places, brl } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/agendamentos/$placeId")({
  loader: ({ params }) => {
    const place = places.find((p) => p.id === params.placeId);
    if (!place) throw notFound();
    return { place };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Estabelecimento indisponível | Ipa+" }, { name: "robots", content: "noindex" }] };
    }
    const { place } = loaderData;
    const desc = `Agende ${place.services.map((s) => s.name).join(", ")} em ${place.name}.`;
    return {
      meta: [
        { title: `${place.name} | Agendamentos Ipa+` },
        { name: "description", content: desc },
        { property: "og:title", content: `${place.name} | Agendamentos Ipa+` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: PlacePage,
});

const weekdays = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function PlacePage() {
  const { place } = Route.useLoaderData();
  const { addOrder } = useStore();
  const navigate = useNavigate();
  const [serviceId, setServiceId] = useState(place.services[0]?.id ?? "");
  const [dayIndex, setDayIndex] = useState(0);
  const [hour, setHour] = useState<string | null>(null);

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 10 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
  }, []);

  const service = place.services.find((s) => s.id === serviceId);
  const day = days[dayIndex]!;

  const confirm = () => {
    if (!service || !hour) return;
    addOrder({
      type: "agendamento",
      title: `${place.name} · ${service.name}`,
      subtitle: `${day.toLocaleDateString("pt-BR")} às ${hour}`,
      total: service.price,
      status: "Confirmado",
    });
    navigate({ to: "/pedidos" });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title={place.name} subtitle={place.type} back="/agendamentos" />

      <main className="mx-auto max-w-md px-4 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="grid size-16 shrink-0 place-items-center rounded-xl accent-soft text-3xl">{place.emoji}</div>
          <div className="min-w-0 text-xs text-muted-foreground">
            <Stars rating={place.rating} />
            <p className="mt-1 inline-flex items-start gap-1">
              <MapPin className="mt-0.5 size-3.5 shrink-0" /> {place.address}
            </p>
          </div>
        </div>

        <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-muted-foreground">1. Serviço</h2>
        <div className="space-y-2">
          {place.services.map((s) => (
            <button
              key={s.id}
              onClick={() => setServiceId(s.id)}
              className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-colors ${
                serviceId === s.id ? "border-primary accent-soft" : "border-border bg-card"
              }`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{s.name}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" /> {s.duration}
                </span>
              </span>
              <span className="shrink-0 text-sm font-bold text-primary">
                {s.price === 0 ? "Grátis" : brl(s.price)}
              </span>
            </button>
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-muted-foreground">2. Data</h2>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {days.map((d, i) => (
            <button
              key={i}
              onClick={() => {
                setDayIndex(i);
                setHour(null);
              }}
              className={`w-14 shrink-0 rounded-2xl border py-2.5 text-center transition-colors ${
                dayIndex === i ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
              }`}
            >
              <span className="block text-[10px] uppercase opacity-70">{weekdays[d.getDay()]}</span>
              <span className="block text-lg font-bold leading-tight">{d.getDate()}</span>
            </button>
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-muted-foreground">3. Horário</h2>
        <div className="grid grid-cols-4 gap-2">
          {place.hours.map((h) => (
            <button
              key={h}
              onClick={() => setHour(h)}
              className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                hour === h ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 bg-background/80 p-4 backdrop-blur">
        <button
          onClick={confirm}
          disabled={!hour}
          className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-card disabled:opacity-50"
        >
          <Check className="size-4" />
          {hour ? `Confirmar ${day.toLocaleDateString("pt-BR")} às ${hour}` : "Selecione um horário"}
        </button>
      </div>
    </div>
  );
}
