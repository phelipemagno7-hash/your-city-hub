import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, Search, Clock, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { Stars } from "@/components/PageHeader";
import { restaurants, brl } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/delivery/")({
  head: () => ({
    meta: [
      { title: "Delivery de Comida em Ipanema | Ipa+" },
      {
        name: "description",
        content: "Lanchonetes, pizzarias, marmitas e restaurantes da cidade com entrega rápida pelo Ipa+.",
      },
      { property: "og:title", content: "Delivery de Comida em Ipanema | Ipa+" },
      { property: "og:description", content: "Peça comida dos melhores restaurantes de Ipanema direto pelo portal." },
    ],
  }),
  component: DeliveryList,
});

const categories = ["Todos", "Lanches", "Pizzas", "Marmitas", "Sobremesas"];

function DeliveryList() {
  const { cartCount } = useStore();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesCategory = activeCategory === "Todos" || r.category === activeCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        {/* Page Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
              <UtensilsCrossed className="size-7 text-primary" /> Delivery de Comida
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Os melhores cardápios e estabelecimentos de Ipanema na sua porta
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/carrinho"
              className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="size-4" />
              <span>Ver Carrinho ({cartCount})</span>
            </Link>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "accent-soft text-foreground/80 hover:bg-accent/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72 flex items-center gap-2 rounded-2xl border border-input bg-card px-3.5 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar restaurante..."
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Restaurants Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border mt-8 bg-card">
            <p className="text-4xl">🔍</p>
            <h2 className="mt-3 font-bold text-base">Nenhum restaurante encontrado</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Tente buscar por outro termo ou categoria.
            </p>
            <button
              onClick={() => {
                setActiveCategory("Todos");
                setSearch("");
              }}
              className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((r) => (
              <Link
                key={r.id}
                to="/delivery/$restaurantId"
                params={{ restaurantId: r.id }}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-4 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="relative grid h-36 place-items-center rounded-2xl accent-soft text-6xl group-hover:scale-105 transition-transform duration-300">
                    {r.emoji}
                    {r.tag && (
                      <span className="absolute top-3 left-3 rounded-full bg-primary/95 text-primary-foreground px-2.5 py-0.5 text-[10px] font-bold shadow-sm">
                        {r.tag}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-bold text-foreground group-hover:text-primary transition-colors text-base truncate">
                        {r.name}
                      </h2>
                      <p className="text-xs font-semibold text-primary">{r.category}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg shrink-0">
                      ★ {r.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="size-3.5 text-primary" /> {r.eta}
                  </span>
                  <span className="font-bold text-foreground">
                    Taxa: {r.deliveryFee === 0 ? "Grátis" : brl(r.deliveryFee)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
