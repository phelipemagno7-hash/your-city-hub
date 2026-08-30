import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Heart, Store, HelpCircle, Bell, ChevronRight, User, ShieldCheck, ArrowRight, LogOut } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu Perfil | Ipa+" },
      { name: "description", content: "Gerencie endereços, favoritos, pedidos e configurações da sua conta no Ipa+." },
      { property: "og:title", content: "Meu Perfil | Ipa+" },
      { property: "og:description", content: "Sua conta no shopping virtual da cidade de Ipanema." },
    ],
  }),
  component: Perfil,
});

const items = [
  { icon: MapPin, label: "Meus Endereços Salvos", hint: "Rua Sete de Setembro, 120 — Centro, Ipanema" },
  { icon: Heart, label: "Meus Favoritos", hint: "Restaurantes, lojas e profissionais favoritados" },
  { icon: Bell, label: "Notificações & Promoções", hint: "Alertas de frete grátis e status de pedidos" },
  { icon: Store, label: "Quero Vender no Ipa+", hint: "Cadastre sua loja, lanchonete ou serviços" },
  { icon: HelpCircle, label: "Central de Ajuda e Suporte", hint: "Fale com o time de suporte de Ipanema" },
];

function Perfil() {
  const { orders, currentUser } = useStore();

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground pb-4 border-b border-border flex items-center gap-2.5">
          <User className="size-7 text-primary" /> Minha Conta
        </h1>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* User Card (Left Column) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card text-center space-y-4">
              <div className="grid size-20 mx-auto place-items-center rounded-3xl accent-soft text-3xl font-black text-primary shadow-sm">
                {currentUser.emoji || "👤"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{currentUser.name}</h2>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 px-3 py-0.5 text-[11px] font-bold">
                    <ShieldCheck className="size-3.5" />
                    {currentUser.role === "merchant" ? `Lojista: ${currentUser.storeName}` : "Cliente Verificado"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-border hover:bg-accent/20 px-3 py-2 text-xs font-bold text-foreground transition-colors"
                >
                  <LogOut className="size-3.5" />
                  <span>Trocar Perfil / Entrar como Lojista</span>
                </Link>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/pedidos"
                className="rounded-2xl accent-soft p-4 text-center hover:opacity-90 transition-opacity"
              >
                <p className="text-2xl font-black text-primary">{orders.length}</p>
                <p className="text-xs font-bold text-foreground mt-0.5">Pedidos / Agendas</p>
              </Link>
              <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-card">
                <p className="text-base font-black text-primary">Ipanema</p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Cidade Ativa</p>
              </div>
            </div>
          </div>

          {/* Account Options (Right Column) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border border-border bg-card shadow-card divide-y divide-border overflow-hidden">
              {items.map(({ icon: Icon, label, hint }) => {
                const isLojista = label.includes("Vender");
                const Comp = isLojista ? Link : "button";
                const props = isLojista ? { to: "/lojista" as any } : { type: "button" as any };
                return (
                  <Comp
                    key={label}
                    {...props}
                    className="flex w-full items-center gap-4 p-5 text-left hover:bg-accent/15 transition-colors group"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl accent-soft text-primary group-hover:scale-105 transition-transform">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {label}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground mt-0.5">
                        {hint}
                      </span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </Comp>
                );
              })}
            </div>

            {/* Merchant Onboarding Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-secondary to-primary p-6 text-primary-foreground shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-bold text-base">É comerciante ou prestador de serviço?</h3>
                <p className="text-xs text-primary-foreground/85">
                  Venda seus produtos e gerencie pedidos e agendamentos no painel do parceiro.
                </p>
              </div>
              <Link
                to="/lojista"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-2xl bg-accent px-4 py-2.5 text-xs font-black text-secondary hover:bg-accent/90 transition-transform hover:scale-105 shadow-md"
              >
                <span>Acessar Painel do Lojista</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
