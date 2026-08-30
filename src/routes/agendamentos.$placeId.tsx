import { createFileRoute, notFound, useNavigate, Link } from "@tanstack/react-router";
import { Check, Clock, MapPin, ChevronLeft, CalendarDays, CheckCircle2, Ban } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { Stars } from "@/components/PageHeader";
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
    const desc = `Agende ${place.services.map((s) => s.name).join(", ")} em ${place.name} em Ipanema.`;
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
  const { addOrder, currentUser, isSlotBlocked, getStoreAppointments } = useStore();
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
  const selectedDateFormatted = day.toLocaleDateString("pt-BR");

  // Get appointments for this specific store
  const currentStoreAppointments = useMemo(
    () => getStoreAppointments(place.id),
    [getStoreAppointments, place.id],
  );

  const confirm = () => {
    if (!service || !hour) return;

    // Check if slot was blocked or booked in the meantime
    const isBlocked = isSlotBlocked(place.id, selectedDateFormatted, hour);
    const isBooked = currentStoreAppointments.some(
      (a) => a.dateStr === selectedDateFormatted && a.hour === hour && a.status !== "Cancelado",
    );

    if (isBlocked || isBooked) {
      toast.error("Este horário não está mais disponível. Por favor, escolha outro.");
      setHour(null);
      return;
    }

    addOrder({
      storeId: place.id,
      type: "agendamento",
      title: `${place.name} · ${service.name}`,
      subtitle: `${selectedDateFormatted} às ${hour} · Cliente: ${currentUser.name}`,
      total: service.price,
      status: "Confirmado",
      customerName: currentUser.name,
      dateStr: selectedDateFormatted,
      hour: hour,
      serviceId: service.id,
    });

    toast.success(`Agendamento confirmado para ${selectedDateFormatted} às ${hour}!`);
    navigate({ to: "/pedidos" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-6">
        <Link
          to="/agendamentos"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ChevronLeft className="size-4" /> Voltar para lista de estabelecimentos
        </Link>

        {/* Place Header Banner */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="grid size-20 shrink-0 place-items-center rounded-2xl accent-soft text-5xl shadow-sm">
            {place.emoji}
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">{place.name}</h1>
              <Stars rating={place.rating} />
            </div>
            <p className="text-sm font-semibold text-primary">{place.type}</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span>{place.address}</span>
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Booking Steps (Left Column) */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Escolha do Serviço */}
            <section className="space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary text-xs font-black">1</span>
                Selecione o Serviço
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {place.services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceId(s.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      serviceId === s.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-sm text-foreground">{s.name}</p>
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="size-3 text-primary" /> {s.duration}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-extrabold text-primary">
                      {s.price === 0 ? "Grátis" : brl(s.price)}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* 2. Escolha da Data */}
            <section className="space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary text-xs font-black">2</span>
                Selecione a Data
              </h2>
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {days.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setDayIndex(i);
                      setHour(null);
                    }}
                    className={`w-16 shrink-0 rounded-2xl border py-3 text-center transition-all ${
                      dayIndex === i
                        ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                        : "border-border bg-card hover:bg-accent/20"
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-bold opacity-80">{weekdays[d.getDay()]}</span>
                    <span className="block text-xl font-black leading-tight mt-0.5">{d.getDate()}</span>
                    <span className="block text-[9px] opacity-70 mt-0.5">
                      {d.toLocaleString("pt-BR", { month: "short" })}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* 3. Escolha do Horário (com checagem de bloqueio e agendamento) */}
            <section className="space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary text-xs font-black">3</span>
                Selecione o Horário Disponível
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {place.hours.map((h) => {
                  const isBlocked = isSlotBlocked(place.id, selectedDateFormatted, h);
                  const isBooked = currentStoreAppointments.some(
                    (a) => a.dateStr === selectedDateFormatted && a.hour === h && a.status !== "Cancelado",
                  );
                  const isUnavailable = isBlocked || isBooked;

                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={isUnavailable}
                      onClick={() => setHour(h)}
                      className={`rounded-2xl border py-3 px-2 text-center transition-all ${
                        isUnavailable
                          ? "border-border/60 bg-muted/40 text-muted-foreground opacity-50 cursor-not-allowed"
                          : hour === h
                          ? "border-primary bg-primary text-primary-foreground shadow-md scale-105 font-black"
                          : "border-border bg-card hover:border-primary/50 text-foreground font-bold"
                      }`}
                    >
                      <span className="block text-sm leading-none">{h}</span>
                      {isUnavailable && (
                        <span className="block text-[9px] font-extrabold text-red-600 mt-1 uppercase">
                          {isBooked ? "Ocupado" : "Pausado"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Booking Summary Sidebar (Right Column) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
              <h2 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
                <CalendarDays className="size-5 text-primary" /> Resumo do Agendamento
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Local:</span>
                  <span className="font-bold text-foreground">{place.name}</span>
                </div>

                <div>
                  <span className="text-muted-foreground block">Serviço:</span>
                  <span className="font-bold text-foreground">{service?.name}</span>
                  <span className="text-muted-foreground block mt-0.5">Duração: {service?.duration}</span>
                </div>

                <div>
                  <span className="text-muted-foreground block">Data e Horário:</span>
                  <span className="font-bold text-foreground">
                    {selectedDateFormatted} {hour ? `às ${hour}` : "(Escolha um horário acima)"}
                  </span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between items-center text-sm font-extrabold text-foreground">
                  <span>Valor do serviço</span>
                  <span className="text-primary text-lg">
                    {service?.price === 0 ? "Grátis" : brl(service?.price ?? 0)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={confirm}
                disabled={!hour}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="size-4" />
                <span>{hour ? "Confirmar Reserva" : "Selecione um horário"}</span>
              </button>

              <p className="text-[11px] text-center text-muted-foreground">
                Você poderá cancelar ou acompanhar seu horário na aba Meus Pedidos.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Floating Confirmation Bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background/90 p-4 backdrop-blur border-t border-border">
        <button
          onClick={confirm}
          disabled={!hour}
          className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-card disabled:opacity-50"
        >
          <Check className="size-4" />
          {hour ? `Confirmar para ${day.getDate()}/${day.getMonth() + 1} às ${hour}` : "Selecione um horário acima"}
        </button>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}
