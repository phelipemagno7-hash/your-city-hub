import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Store, Search } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { products, brl } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/vitrine")({
  head: () => ({
    meta: [
      { title: "Vitrine Virtual de Lojas | Ipa+" },
      {
        name: "description",
        content: "Catálogo de roupas, calçados, casa e variedades das lojas de Ipanema. Fale direto com o vendedor pelo WhatsApp.",
      },
      { property: "og:title", content: "Vitrine Virtual de Lojas | Ipa+" },
      { property: "og:description", content: "Produtos das lojas locais com atendimento direto pelo WhatsApp." },
    ],
  }),
  component: Vitrine,
});

const categories = ["Todos", "Moda", "Calçados", "Casa", "Beleza", "Esporte"];

function Vitrine() {
  const { isItemPaused } = useStore();
  const [active, setActive] = useState("Todos");
  const [search, setSearch] = useState("");

  const list = products.filter((p) => {
    const matchesCategory = active === "Todos" || p.category === active;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.store.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
              <Store className="size-7 text-primary" /> Vitrine Virtual das Lojas
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Explore o catálogo dos lojistas de Ipanema e negocie diretamente com eles
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                  active === c
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "accent-soft text-foreground/80 hover:bg-accent/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72 flex items-center gap-2 rounded-2xl border border-input bg-card px-3.5 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos ou lojas..."
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Products Grid */}
        {list.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border mt-8 bg-card">
            <p className="text-4xl">🛍️</p>
            <h2 className="mt-3 font-bold text-base">Nenhum produto encontrado</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Tente buscar por outro termo ou categoria.
            </p>
            <button
              onClick={() => {
                setActive("Todos");
                setSearch("");
              }}
              className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {list.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-4 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="grid h-36 place-items-center rounded-2xl accent-soft text-5xl group-hover:scale-105 transition-transform duration-300">
                    {p.emoji}
                  </div>
                  <span className="mt-3 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                    {p.store}
                  </span>
                  <h2 className="text-sm font-bold text-foreground leading-snug mt-0.5 line-clamp-2">
                    {p.name}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60">
                  <div className="flex items-center justify-between">
                    <p className="text-base sm:text-lg font-extrabold text-primary">{brl(p.price)}</p>
                    {isItemPaused(p.id) && (
                      <span className="rounded-full bg-red-100 text-red-800 px-2 py-0.5 text-[9px] font-extrabold">
                        Esgotado
                      </span>
                    )}
                  </div>
                  {isItemPaused(p.id) ? (
                    <button
                      type="button"
                      disabled
                      className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-muted text-muted-foreground px-3 py-2 text-xs font-bold cursor-not-allowed w-full opacity-70"
                    >
                      Indisponível no Momento
                    </button>
                  ) : (
                    <a
                      href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Olá! Vi o produto "${p.name}" na Vitrine do Ipa+ e gostaria de mais informações.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-102 shadow-sm w-full"
                    >
                      <MessageCircle className="size-3.5" /> Falar com loja
                    </a>
                  )}
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
