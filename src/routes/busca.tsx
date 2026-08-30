import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { restaurants, products, professionals, places, brl } from "@/lib/data";

export const Route = createFileRoute("/busca")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Buscar na cidade | Ipa+" },
      { name: "description", content: "Busque restaurantes, produtos, profissionais e estabelecimentos da cidade." },
      { property: "og:title", content: "Buscar na cidade | Ipa+" },
      { property: "og:description", content: "Encontre tudo o que a economia local oferece em um só lugar." },
    ],
  }),
  component: Busca,
});

function Busca() {
  const { q: initial } = Route.useSearch();
  const [q, setQ] = useState(initial ?? "");
  const term = q.trim().toLowerCase();
  const match = (s: string) => term.length > 0 && s.toLowerCase().includes(term);

  const r = restaurants.filter((x) => match(`${x.name} ${x.category}`));
  const p = products.filter((x) => match(`${x.name} ${x.store} ${x.category}`));
  const s = professionals.filter((x) => match(`${x.name} ${x.specialty}`));
  const a = places.filter((x) => match(`${x.name} ${x.type}`));
  const empty = r.length + p.length + s.length + a.length === 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Busca" subtitle="Tudo da cidade em um lugar" />
      <main className="mx-auto max-w-md px-4 pt-4">
        <div className="flex items-center gap-2 rounded-2xl border border-input bg-card px-3 py-2.5">
          <Search className="size-5 shrink-0 text-primary" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pizza, eletricista, barbearia..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {term.length === 0 ? (
          <p className="mt-8 text-center text-xs text-muted-foreground">Digite para buscar em toda a cidade.</p>
        ) : empty ? (
          <p className="mt-8 text-center text-xs text-muted-foreground">Nenhum resultado para “{q}”.</p>
        ) : (
          <div className="mt-5 space-y-6">
            {r.length > 0 && (
              <Group title="Delivery">
                {r.map((x) => (
                  <Link
                    key={x.id}
                    to="/delivery/$restaurantId"
                    params={{ restaurantId: x.id }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl accent-soft text-xl">{x.emoji}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{x.name}</span>
                      <span className="block text-xs text-muted-foreground">{x.category}</span>
                    </span>
                  </Link>
                ))}
              </Group>
            )}
            {p.length > 0 && (
              <Group title="Vitrine">
                {p.map((x) => (
                  <Link key={x.id} to="/vitrine" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl accent-soft text-xl">{x.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{x.name}</span>
                      <span className="block text-xs text-muted-foreground">{x.store}</span>
                    </span>
                    <span className="shrink-0 text-sm font-bold text-primary">{brl(x.price)}</span>
                  </Link>
                ))}
              </Group>
            )}
            {s.length > 0 && (
              <Group title="Profissionais">
                {s.map((x) => (
                  <Link key={x.id} to="/profissionais" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full accent-soft text-xs font-bold text-primary">
                      {x.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{x.name}</span>
                      <span className="block text-xs text-muted-foreground">{x.specialty}</span>
                    </span>
                  </Link>
                ))}
              </Group>
            )}
            {a.length > 0 && (
              <Group title="Agendamentos">
                {a.map((x) => (
                  <Link
                    key={x.id}
                    to="/agendamentos/$placeId"
                    params={{ placeId: x.id }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl accent-soft text-xl">{x.emoji}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{x.name}</span>
                      <span className="block text-xs text-muted-foreground">{x.type}</span>
                    </span>
                  </Link>
                ))}
              </Group>
            )}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
