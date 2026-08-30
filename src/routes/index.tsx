import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  UtensilsCrossed,
  Store,
  HardHat,
  CalendarDays,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { restaurants, products, professionals, places, brl } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ipa+ | Shopping virtual e serviços de Ipanema - MG" },
      {
        name: "description",
        content:
          "Delivery de comida, lojas locais, profissionais autônomos e agendamentos de beleza e saúde em um só portal da sua cidade.",
      },
      { property: "og:title", content: "Ipa+ | Shopping virtual e serviços de Ipanema - MG" },
      {
        property: "og:description",
        content: "Peça comida, compre em lojas locais, contrate profissionais e agende serviços em Ipanema.",
      },
    ],
  }),
  component: Index,
});

const categories = [
  {
    to: "/delivery",
    label: "Delivery",
    hint: "Restaurantes e lanchonetes",
    desc: "Cardápios, lanches, pizzas e marmitas com entrega rápida",
    icon: UtensilsCrossed,
    color: "from-emerald-500/10 to-teal-500/20",
    badge: "Mais pedido",
  },
  {
    to: "/vitrine",
    label: "Vitrine Virtual",
    hint: "Lojas e comércio local",
    desc: "Roupas, sapatos, presentes e artigos para sua casa",
    icon: Store,
    color: "from-teal-500/10 to-cyan-500/20",
    badge: "WhatsApp direto",
  },
  {
    to: "/profissionais",
    label: "Profissionais",
    hint: "Serviços e reformas",
    desc: "Eletricistas, pedreiros, diaristas, pintores e marceneiros",
    icon: HardHat,
    color: "from-cyan-500/10 to-emerald-500/20",
    badge: "Avaliados",
  },
  {
    to: "/agendamentos",
    label: "Agendamentos",
    hint: "Beleza e saúde",
    desc: "Barbearias, salões, clínicas e estética com horário marcado",
    icon: CalendarDays,
    color: "from-emerald-500/15 to-teal-500/15",
    badge: "Sem filas",
  },
] as const;

function Index() {
  const [q, setQ] = useState("");
  const navigate = Route.useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate({ to: "/busca", search: { q: q.trim() } });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-secondary via-secondary to-secondary/95 text-secondary-foreground py-10 md:py-16 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(132,225,188,0.2),rgba(255,255,255,0))]" />
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary-foreground/10 px-4 py-1.5 text-xs font-semibold text-accent backdrop-blur-sm">
                <Sparkles className="size-3.5" />
                <span>O portal oficial do comércio de Ipanema - MG</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Tudo o que a sua cidade oferece em um só lugar.
              </h1>

              <p className="text-sm sm:text-base text-secondary-foreground/80 max-w-2xl mx-auto">
                Peça delivery de comida, compre produtos das lojas locais, contrate os melhores profissionais e agende seus horários sem complicações.
              </p>

              {/* Main Search Bar in Hero */}
              <form
                onSubmit={handleSearch}
                className="mt-6 flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto rounded-2xl bg-card p-2 shadow-xl border border-border/50 text-foreground"
              >
                <div className="flex items-center gap-3 w-full px-3 py-2">
                  <Search className="size-5 text-primary shrink-0" />
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="O que você está procurando hoje? (ex: Pizza, Pedreiro, Tênis...)"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
                >
                  Buscar
                </button>
              </form>

              {/* Quick Tags */}
              <div className="pt-2 flex flex-wrap justify-center items-center gap-2 text-xs text-secondary-foreground/70">
                <span className="font-semibold text-secondary-foreground/90">Mais buscados:</span>
                {["Lanches", "Pizza", "Diarista", "Barbearia", "Roupas"].map((tag) => (
                  <Link
                    key={tag}
                    to="/busca"
                    search={{ q: tag }}
                    className="rounded-full bg-secondary-foreground/10 px-3 py-1 hover:bg-secondary-foreground/20 hover:text-accent transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4 MAIN CATEGORIES GRID */}
        <section className="container mx-auto max-w-6xl px-4 -mt-6 sm:-mt-10 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {categories.map(({ to, label, hint, desc, icon: Icon, color, badge }) => (
              <Link
                key={to}
                to={to}
                className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br ${color} blur-xl group-hover:scale-150 transition-transform duration-500`} />
                
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl accent-soft text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                      <Icon className="size-6" />
                    </span>
                    <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold text-secondary">
                      {badge}
                    </span>
                  </div>

                  <h2 className="mt-4 text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {label}
                  </h2>
                  <p className="text-xs font-semibold text-primary">{hint}</p>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed hidden sm:block">
                    {desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                  <span>Acessar</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PROMOTION BANNER */}
        <section className="container mx-auto max-w-6xl px-4 mt-10 sm:mt-14">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-secondary p-6 sm:p-8 text-primary-foreground shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-block rounded-full bg-accent/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary-foreground">
                Oferta Especial de Lançamento
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Frete grátis no Cantinho Mineiro
              </h3>
              <p className="text-sm text-primary-foreground/90 max-w-xl">
                Aproveite marmitas tradicionais com frete 100% grátis para pedidos acima de R$ 30 hoje até as 22h.
              </p>
            </div>
            <Link
              to="/delivery/$restaurantId"
              params={{ restaurantId: "cantinho-mineiro" }}
              className="shrink-0 rounded-2xl bg-accent px-6 py-3.5 text-sm font-extrabold text-secondary hover:bg-accent/90 transition-transform hover:scale-105 shadow-md"
            >
              Pedir agora no Cantinho Mineiro
            </Link>
          </div>
        </section>

        {/* DELIVERY SECTION */}
        <section className="container mx-auto max-w-6xl px-4 mt-12 sm:mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <UtensilsCrossed className="size-6 text-primary" /> Delivery de Alimentação
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Restaurantes, lanchonetes e sobremesas com entrega rápida na sua porta
              </p>
            </div>
            <Link
              to="/delivery"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Ver todos ({restaurants.length}) <ChevronRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {restaurants.map((r) => (
              <Link
                key={r.id}
                to="/delivery/$restaurantId"
                params={{ restaurantId: r.id }}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-4 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="relative grid h-32 place-items-center rounded-2xl accent-soft text-5xl group-hover:scale-105 transition-transform duration-300">
                    {r.emoji}
                    {r.tag && (
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-primary/90 text-primary-foreground px-2.5 py-0.5 text-[10px] font-bold shadow-sm">
                        {r.tag}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-base truncate">
                        {r.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{r.category}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg shrink-0">
                      ★ {r.rating}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
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
        </section>

        {/* VITRINE SECTION */}
        <section className="container mx-auto max-w-6xl px-4 mt-12 sm:mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Store className="size-6 text-primary" /> Vitrine Virtual das Lojas
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Produtos das lojas de Ipanema com compra e atendimento direto pelo WhatsApp
              </p>
            </div>
            <Link
              to="/vitrine"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Ver catálogo completo <ChevronRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {products.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-3 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="grid h-28 place-items-center rounded-xl accent-soft text-4xl group-hover:scale-105 transition-transform duration-300">
                    {p.emoji}
                  </div>
                  <span className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate w-full">
                    {p.store}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 leading-snug">
                    {p.name}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-border/50">
                  <p className="text-sm sm:text-base font-extrabold text-primary">{brl(p.price)}</p>
                  <a
                    href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Olá! Vi o produto "${p.name}" no portal Ipa+ e gostaria de mais informações.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-1 rounded-xl bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary py-1.5 px-2 text-[11px] font-bold transition-colors w-full"
                  >
                    <MessageCircle className="size-3" /> Falar com loja
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PROFISSIONAIS & AGENDAMENTOS SECTION */}
        <section className="container mx-auto max-w-6xl px-4 mt-12 sm:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profissionais Preview */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="grid size-10 place-items-center rounded-xl accent-soft text-primary">
                    <HardHat className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Profissionais Autônomos</h3>
                    <p className="text-xs text-muted-foreground">Classificados com contato direto</p>
                  </div>
                </div>
                <Link to="/profissionais" className="text-xs font-bold text-primary hover:underline">
                  Ver todos
                </Link>
              </div>

              <div className="space-y-3">
                {professionals.slice(0, 3).map((prof) => (
                  <div
                    key={prof.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 p-3 hover:bg-accent/15 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid size-11 place-items-center rounded-full accent-soft font-black text-sm text-primary shrink-0">
                        {prof.initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm truncate">{prof.name}</h4>
                        <p className="text-xs text-primary font-semibold">{prof.specialty}</p>
                        <p className="text-[11px] text-muted-foreground">★ {prof.rating.toFixed(1)} · {prof.area}</p>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${prof.phone}?text=${encodeURIComponent(`Olá ${prof.name}, encontrei seu perfil no Ipa+ e gostaria de um orçamento.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Orçamento
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Agendamentos Preview */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="grid size-10 place-items-center rounded-xl accent-soft text-primary">
                    <CalendarDays className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Agendamentos & Estética</h3>
                    <p className="text-xs text-muted-foreground">Reserve barbearias, salões e clínicas</p>
                  </div>
                </div>
                <Link to="/agendamentos" className="text-xs font-bold text-primary hover:underline">
                  Ver todos
                </Link>
              </div>

              <div className="space-y-3">
                {places.slice(0, 3).map((place) => (
                  <Link
                    key={place.id}
                    to="/agendamentos/$placeId"
                    params={{ placeId: place.id }}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 p-3 hover:bg-accent/15 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid size-11 place-items-center rounded-xl accent-soft text-2xl shrink-0">
                        {place.emoji}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                          {place.name}
                        </h4>
                        <p className="text-xs text-primary font-semibold">{place.type}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{place.address}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-xl bg-secondary-foreground/10 group-hover:bg-primary group-hover:text-primary-foreground px-3 py-1.5 text-xs font-bold transition-colors">
                      Agendar
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TRUST & LOCAL COMMERCE VALUE PROPOSITION */}
        <section className="container mx-auto max-w-6xl px-4 my-14 sm:my-20">
          <div className="rounded-3xl bg-secondary p-8 sm:p-12 text-secondary-foreground shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="space-y-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-accent text-secondary font-black mx-auto md:mx-0">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="text-lg font-bold">100% Comércio Local</h3>
                <p className="text-xs text-secondary-foreground/80 leading-relaxed">
                  Cada pedido ou contratação feita pelo Ipa+ movimenta diretamente o dinheiro dentro de Ipanema.
                </p>
              </div>

              <div className="space-y-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-accent text-secondary font-black mx-auto md:mx-0">
                  <Clock className="size-6" />
                </div>
                <h3 className="text-lg font-bold">Praticidade e Rapidez</h3>
                <p className="text-xs text-secondary-foreground/80 leading-relaxed">
                  Acesse cardápios, lojas e profissionais em segundos sem precisar instalar múltiplos aplicativos.
                </p>
              </div>

              <div className="space-y-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-accent text-secondary font-black mx-auto md:mx-0">
                  <Store className="size-6" />
                </div>
                <h3 className="text-lg font-bold">Cadastre seu Negócio</h3>
                <p className="text-xs text-secondary-foreground/80 leading-relaxed">
                  Coloque seus produtos ou serviços na vitrine virtual mais acessada da cidade de forma simples.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
