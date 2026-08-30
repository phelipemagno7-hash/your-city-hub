import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Heart, Store, HelpCircle, Bell, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil | Ipa+" },
      { name: "description", content: "Gerencie endereços, favoritos e notificações da sua conta no Ipa+." },
      { property: "og:title", content: "Meu perfil | Ipa+" },
      { property: "og:description", content: "Sua conta no shopping virtual da cidade." },
    ],
  }),
  component: Perfil,
});

const items = [
  { icon: MapPin, label: "Meus endereços", hint: "Rua Sete de Setembro, 120" },
  { icon: Heart, label: "Favoritos", hint: "Lojas e restaurantes salvos" },
  { icon: Bell, label: "Notificações", hint: "Ofertas e status de pedidos" },
  { icon: Store, label: "Quero vender no Ipa+", hint: "Cadastre sua loja ou serviço" },
  { icon: HelpCircle, label: "Ajuda e suporte", hint: "Fale com a nossa equipe" },
];

function Perfil() {
  const { orders } = useStore();

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Perfil" subtitle="Sua conta no Ipa+" />

      <main className="mx-auto max-w-md px-4 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="grid size-14 shrink-0 place-items-center rounded-full accent-soft text-lg font-extrabold text-primary">
            PM
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold">Phelipe Magno</p>
            <p className="text-xs text-muted-foreground">phelipe@email.com</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link to="/pedidos" className="rounded-2xl accent-soft p-4">
            <p className="text-2xl font-extrabold text-primary">{orders.length}</p>
            <p className="text-xs font-semibold">Pedidos e agendas</p>
          </Link>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <p className="text-2xl font-extrabold text-primary">Ipanema</p>
            <p className="text-xs font-semibold text-muted-foreground">Cidade atual</p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {items.map(({ icon: Icon, label, hint }) => (
            <button key={label} className="flex w-full items-center gap-3 p-4 text-left">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl accent-soft text-primary">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{label}</span>
                <span className="block truncate text-xs text-muted-foreground">{hint}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Ipa+ · feito para fortalecer o comércio local
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
