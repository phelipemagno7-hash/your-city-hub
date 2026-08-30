import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, UtensilsCrossed, CalendarDays, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { brl } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Meus Pedidos e Agendamentos | Ipa+" },
      { name: "description", content: "Acompanhe seus pedidos de delivery e horários agendados em Ipanema pelo Ipa+." },
      { property: "og:title", content: "Meus Pedidos e Agendamentos | Ipa+" },
      { property: "og:description", content: "Histórico de pedidos e agendamentos no portal." },
    ],
  }),
  component: Pedidos,
});

function Pedidos() {
  const { orders } = useStore();
  const [filter, setFilter] = useState<"todos" | "delivery" | "agendamento">("todos");

  const filteredOrders = orders.filter((o) => {
    if (filter === "todos") return true;
    return o.type === filter;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2.5">
              <ClipboardList className="size-7 text-primary" /> Meus Pedidos & Agendas
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Acompanhe o andamento dos seus pedidos de delivery e horários marcados
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 rounded-2xl bg-card border border-border p-1">
            {[
              { id: "todos", label: "Todos" },
              { id: "delivery", label: "Delivery" },
              { id: "agendamento", label: "Agendamentos" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(id as any)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  filter === id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-card max-w-md mx-auto">
            <p className="text-5xl">📋</p>
            <h2 className="mt-4 text-lg font-bold text-foreground">Nenhum registro encontrado</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Seus pedidos de delivery e serviços agendados aparecerão organizados aqui.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/delivery"
                className="rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Fazer um Pedido
              </Link>
              <Link
                to="/agendamentos"
                className="rounded-2xl border border-border bg-background px-5 py-2.5 text-xs font-bold text-foreground hover:bg-accent/20 transition-colors"
              >
                Agendar Horário
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((o) => (
              <article
                key={o.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-lg transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-11 place-items-center rounded-2xl accent-soft text-primary">
                        {o.type === "delivery" ? (
                          <UtensilsCrossed className="size-5" />
                        ) : (
                          <CalendarDays className="size-5" />
                        )}
                      </div>
                      <div>
                        <h2 className="font-bold text-base text-foreground leading-snug">{o.title}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">{o.subtitle}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full accent-soft px-3 py-1 text-xs font-bold text-primary">
                      {o.status}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Código: <strong className="text-foreground">#{o.id}</strong> · {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="text-base font-extrabold text-primary">
                    {o.total === 0 ? "Grátis" : brl(o.total)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
