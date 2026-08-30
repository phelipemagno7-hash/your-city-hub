import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, UtensilsCrossed, Store, HardHat, CalendarDays, MapPin } from "lucide-react";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { restaurants, products, brl } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ipa+ | Shopping virtual e serviços da sua cidade" },
      {
        name: "description",
        content:
          "Delivery, lojas locais, profissionais autônomos e agendamentos de beleza e saúde em um só app da sua cidade.",
      },
      { property: "og:title", content: "Ipa+ | Shopping virtual e serviços da sua cidade" },
      {
        property: "og:description",
        content: "Peça comida, compre em lojas locais, contrate profissionais e agende serviços.",
      },
    ],
  }),
  component: Index,
});

const categories = [
  { to: "/delivery", label: "Delivery", hint: "Comida e lanches", icon: UtensilsCrossed },
  { to: "/vitrine", label: "Vitrine", hint: "Lojas locais", icon: Store },
  { to: "/profissionais", label: "Profissionais", hint: "Serviços gerais", icon: HardHat },
  { to: "/agendamentos", label: "Agendamentos", hint: "Beleza e saúde", icon: CalendarDays },
] as const;

function Index() {
  const [q, setQ] = useState("");
  const navigate = Route.useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="rounded-b-3xl bg-secondary px-4 pb-6 pt-6 text-secondary-foreground">
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold tracking-tight">
                Ipa<span className="text-accent">+</span>
              </p>
              <p className="inline-flex items-center gap-1 text-xs text-secondary-foreground/70">
                <MapPin className="size-3.5" /> Entregando em Ipanema · MG
              </p>
            </div>
            <div className="grid size-10 place-items-center rounded-full bg-secondary-foreground/10 text-sm font-bold">
              PM
            </div>
          </div>

          <form
            className="mt-5 flex items-center gap-2 rounded-2xl bg-card px-3 py-2.5 shadow-card"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/busca", search: { q } });
            }}
          >
            <Search className="size-5 shrink-0 text-primary" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar lojas, pratos ou serviços"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4">
        <section className="-mt-4">
          <div className="grid grid-cols-2 gap-3">
            {categories.map(({ to, label, hint, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="rounded-2xl border border-border bg-card p-4 shadow-card transition-colors hover:bg-accent/25"
              >
                <span className="grid size-11 place-items-center rounded-xl accent-soft text-primary">
                  <Icon className="size-5" />
                </span>
                <p className="mt-3 text-sm font-bold">{label}</p>
                <p className="text-xs text-muted-foreground">{hint}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <div className="rounded-2xl accent-soft p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Oferta do dia</p>
            <p className="mt-1 text-base font-bold">Frete grátis no Cantinho Mineiro</p>
            <p className="text-xs text-foreground/70">Pedidos acima de R$ 30 até as 22h</p>
            <Link
              to="/delivery/$restaurantId"
              params={{ restaurantId: "cantinho-mineiro" }}
              className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              Aproveitar
            </Link>
          </div>
        </section>

        <Section title="Peça agora" to="/delivery">
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {restaurants.map((r) => (
              <Link
                key={r.id}
                to="/delivery/$restaurantId"
                params={{ restaurantId: r.id }}
                className="w-40 shrink-0 rounded-2xl border border-border bg-card p-3 shadow-card"
              >
                <div className="grid h-20 place-items-center rounded-xl accent-soft text-3xl">{r.emoji}</div>
                <p className="mt-2 truncate text-sm font-bold">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  ★ {r.rating} · {r.eta}
                </p>
              </Link>
            ))}
          </div>
        </Section>

        <Section title="Vitrine das lojas" to="/vitrine">
          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                to="/vitrine"
                className="rounded-2xl border border-border bg-card p-3 shadow-card"
              >
                <div className="grid h-24 place-items-center rounded-xl accent-soft text-3xl">{p.emoji}</div>
                <p className="mt-2 truncate text-sm font-semibold">{p.name}</p>
                <p className="text-sm font-bold text-primary">{brl(p.price)}</p>
              </Link>
            ))}
          </div>
        </Section>
      </main>

      <BottomNav />
    </div>
  );
}

function Section({ title, to, children }: { title: string; to: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold">{title}</h2>
        <Link to={to} className="text-xs font-semibold text-primary">
          Ver tudo
        </Link>
      </div>
      {children}
    </section>
  );
}
