import { Link, useNavigate } from "@tanstack/react-router";
import {
  MapPin,
  Search,
  ShoppingBag,
  User,
  ClipboardList,
  UtensilsCrossed,
  Store,
  HardHat,
  CalendarDays,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

export function Navbar() {
  const { cartCount, currentUser } = useStore();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate({ to: "/busca", search: { q: q.trim() } });
    }
  };

  const navLinks = [
    { to: "/delivery", label: "Delivery", icon: UtensilsCrossed },
    { to: "/vitrine", label: "Vitrine", icon: Store },
    { to: "/profissionais", label: "Profissionais", icon: HardHat },
    { to: "/agendamentos", label: "Agendamentos", icon: CalendarDays },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-secondary text-secondary-foreground shadow-sm backdrop-blur-md">
      {/* Top Banner / City & User Auth Bar */}
      <div className="border-b border-secondary-foreground/10 bg-secondary-foreground/5 px-4 py-1.5 text-xs">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-secondary-foreground/80">
            <MapPin className="size-3.5 text-accent" />
            <span>
              Você está em: <strong className="text-secondary-foreground">Ipanema — MG</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-secondary-foreground/85 text-[11px]">
            {currentUser.role === "merchant" ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-secondary-foreground/70">Loja ativa:</span>
                <Link
                  to="/lojista"
                  className="inline-flex items-center gap-1 font-extrabold text-accent hover:underline bg-accent/15 px-2 py-0.5 rounded-lg border border-accent/30"
                >
                  <span>{currentUser.emoji}</span>
                  <span>{currentUser.storeName}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline text-secondary-foreground/70">Conectado como:</span>
                <Link to="/perfil" className="font-bold text-accent hover:underline">
                  👤 {currentUser.name}
                </Link>
              </div>
            )}

            <span>•</span>

            <Link
              to="/login"
              className="hover:text-accent font-semibold transition-colors flex items-center gap-1"
              title="Trocar de conta ou entrar como outro estabelecimento"
            >
              <LogOut className="size-3" />
              <span>Trocar Conta</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              I+
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-secondary-foreground">
                Ipa<span className="text-accent">+</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-semibold tracking-wider text-secondary-foreground/60 -mt-1">
                Shopping & Serviços
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg items-center gap-2 rounded-2xl bg-card px-3.5 py-2 shadow-sm border border-border/40 text-foreground"
          >
            <Search className="size-4.5 text-primary shrink-0" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar restaurantes, produtos ou serviços em Ipanema..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="text-xs text-muted-foreground hover:text-foreground px-1"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="rounded-xl bg-primary px-3 py-1 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Buscar
            </button>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/busca"
              className="md:hidden grid size-10 place-items-center rounded-xl bg-secondary-foreground/10 text-secondary-foreground hover:bg-secondary-foreground/20 transition-colors"
              aria-label="Buscar"
            >
              <Search className="size-5" />
            </Link>

            <Link
              to="/lojista"
              className="hidden lg:flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/15 px-3 py-2 text-xs font-bold text-secondary-foreground hover:bg-accent/25 transition-all"
            >
              <Store className="size-3.5 text-accent" />
              <span>{currentUser.role === "merchant" ? "Meu Painel" : "Painel Lojista"}</span>
            </Link>

            <Link
              to="/pedidos"
              className="hidden sm:flex items-center gap-2 rounded-xl bg-secondary-foreground/10 px-3.5 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary-foreground/20 transition-colors"
            >
              <ClipboardList className="size-4 text-accent" />
              <span>Pedidos</span>
            </Link>

            <Link
              to="/carrinho"
              className="relative flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-102"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-accent text-[10px] font-black text-accent-foreground">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/perfil"
              className="grid size-10 place-items-center rounded-xl bg-secondary-foreground/10 text-secondary-foreground hover:bg-secondary-foreground/20 transition-colors"
              title="Meu Perfil"
            >
              <User className="size-5" />
            </Link>
          </div>
        </div>

        {/* Desktop Category Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between gap-2 pt-3 mt-2 border-t border-secondary-foreground/10">
          <div className="flex items-center gap-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: false }}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-secondary-foreground/80 hover:bg-secondary-foreground/10 hover:text-secondary-foreground transition-colors"
                activeProps={{ className: "!bg-primary !text-primary-foreground shadow-sm" }}
              >
                <Icon className="size-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <Link
            to="/lojista"
            activeOptions={{ exact: false }}
            className="flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold text-accent bg-secondary-foreground/10 hover:bg-accent hover:text-secondary transition-all"
            activeProps={{ className: "!bg-accent !text-secondary shadow-sm" }}
          >
            <LayoutDashboard className="size-3.5" />
            <span>{currentUser.role === "merchant" ? `Painel · ${currentUser.storeName}` : "Acessar Painel do Lojista"}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
