import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, UtensilsCrossed, Store, HardHat, CalendarDays, ArrowRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { restaurants, products, professionals, places, brl } from "@/lib/data";

export const Route = createFileRoute("/busca")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Buscar em Ipanema | Ipa+" },
      { name: "description", content: "Busque restaurantes, produtos, profissionais e estabelecimentos de Ipanema." },
      { property: "og:title", content: "Buscar em Ipanema | Ipa+" },
      { property: "og:description", content: "Encontre tudo o que o comércio de Ipanema oferece em um só lugar." },
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
  const totalResults = r.length + p.length + s.length + a.length;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground pb-4 border-b border-border flex items-center gap-2.5">
          <Search className="size-7 text-primary" /> Busca Geral da Cidade
        </h1>

        {/* Large Search Input */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-input bg-card px-4 py-3 shadow-sm max-w-2xl">
          <Search className="size-5 text-primary shrink-0" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Digite o que procura (ex: pizza, celular, eletricista, corte de cabelo...)"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="text-xs text-muted-foreground hover:text-foreground px-2"
            >
              ✕
            </button>
          )}
        </div>

        {/* Results */}
        {term.length === 0 ? (
          <div className="mt-12 text-center py-12 rounded-3xl border border-dashed border-border bg-card max-w-xl mx-auto">
            <p className="text-4xl">🔍</p>
            <h2 className="mt-3 font-bold text-base">Pesquise em todo o comércio de Ipanema</h2>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              Digite acima para encontrar lanchonetes, produtos em lojas locais, prestadores de serviços ou agendamentos.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
              {["Burger", "Pizza", "Marmita", "Tênis", "Vestido", "Eletricista", "Barbearia"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQ(tag)}
                  className="rounded-full accent-soft px-3 py-1 font-bold text-foreground/80 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : totalResults === 0 ? (
          <div className="mt-12 text-center py-12 rounded-3xl border border-dashed border-border bg-card max-w-xl mx-auto">
            <p className="text-4xl">😕</p>
            <h2 className="mt-3 font-bold text-base">Nenhum resultado encontrado para “{q}”</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Verifique a ortografia ou tente buscar por termos mais genéricos.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            <p className="text-xs text-muted-foreground font-semibold">
              Encontrados <strong>{totalResults}</strong> resultados para “{q}”
            </p>

            {/* Delivery Results */}
            {r.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <UtensilsCrossed className="size-5 text-primary" /> Delivery de Alimentação ({r.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {r.map((x) => (
                    <Link
                      key={x.id}
                      to="/delivery/$restaurantId"
                      params={{ restaurantId: x.id }}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/40 transition-colors"
                    >
                      <span className="grid size-14 shrink-0 place-items-center rounded-xl accent-soft text-3xl">
                        {x.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-sm text-foreground">{x.name}</span>
                        <span className="block text-xs text-primary font-semibold">{x.category}</span>
                        <span className="block text-[11px] text-muted-foreground mt-0.5">★ {x.rating.toFixed(1)} · {x.eta}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Vitrine Results */}
            {p.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Store className="size-5 text-primary" /> Produtos nas Lojas ({p.length})
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {p.map((x) => (
                    <article
                      key={x.id}
                      className="flex flex-col justify-between rounded-2xl border border-border bg-card p-3 shadow-card"
                    >
                      <div>
                        <span className="grid h-28 place-items-center rounded-xl accent-soft text-4xl">
                          {x.emoji}
                        </span>
                        <span className="block text-[10px] uppercase font-bold text-muted-foreground mt-2 truncate">
                          {x.store}
                        </span>
                        <span className="block font-bold text-xs text-foreground mt-0.5 line-clamp-2">
                          {x.name}
                        </span>
                      </div>
                      <div className="mt-3 pt-2 border-t border-border/50">
                        <span className="block text-sm font-extrabold text-primary">{brl(x.price)}</span>
                        <a
                          href={`https://wa.me/${x.whatsapp}?text=${encodeURIComponent(`Olá! Vi o produto "${x.name}" na busca do Ipa+ e gostaria de mais informações.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center justify-center gap-1 rounded-xl bg-primary text-primary-foreground py-1 px-2 text-[10px] font-bold"
                        >
                          <MessageCircle className="size-3" /> Falar com loja
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Profissionais Results */}
            {s.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <HardHat className="size-5 text-primary" /> Profissionais Autônomos ({s.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {s.map((x) => (
                    <Link
                      key={x.id}
                      to="/profissionais"
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="grid size-12 place-items-center rounded-2xl accent-soft text-sm font-black text-primary shrink-0">
                          {x.initials}
                        </span>
                        <div className="min-w-0">
                          <span className="block truncate font-bold text-sm text-foreground">{x.name}</span>
                          <span className="block text-xs text-primary font-semibold">{x.specialty}</span>
                          <span className="block text-[11px] text-muted-foreground">★ {x.rating.toFixed(1)} · {x.area}</span>
                        </div>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Agendamentos Results */}
            {a.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <CalendarDays className="size-5 text-primary" /> Agendamentos & Estética ({a.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {a.map((x) => (
                    <Link
                      key={x.id}
                      to="/agendamentos/$placeId"
                      params={{ placeId: x.id }}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/40 transition-colors"
                    >
                      <span className="grid size-14 shrink-0 place-items-center rounded-xl accent-soft text-3xl">
                        {x.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-sm text-foreground">{x.name}</span>
                        <span className="block text-xs text-primary font-semibold">{x.type}</span>
                        <span className="block text-[11px] text-muted-foreground truncate">{x.address}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
