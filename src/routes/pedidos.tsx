import { createFileRoute, Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { brl } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Meus pedidos e agendas | Ipa+" },
      { name: "description", content: "Acompanhe seus pedidos de delivery e horários agendados no Ipa+." },
      { property: "og:title", content: "Meus pedidos e agendas | Ipa+" },
      { property: "og:description", content: "Histórico de pedidos e agendamentos." },
    ],
  }),
  component: Pedidos,
});

function Pedidos() {
  const { orders } = useStore();

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Meus pedidos" subtitle="Delivery e agendamentos" />
      <main className="mx-auto max-w-md px-4 pt-4">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <p className="text-4xl">📋</p>
            <p className="mt-3 font-bold">Nada por aqui ainda</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Seus pedidos e horários marcados aparecem nesta tela.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Explorar o Ipa+
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <article key={o.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{o.title}</p>
                    <p className="text-xs text-muted-foreground">{o.subtitle}</p>
                  </div>
                  <span className="shrink-0 rounded-full accent-soft px-2.5 py-1 text-[10px] font-bold text-primary">
                    {o.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>
                    #{o.id} · {o.type === "delivery" ? "Delivery" : "Agendamento"}
                  </span>
                  <span className="text-sm font-bold text-primary">{brl(o.total)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
