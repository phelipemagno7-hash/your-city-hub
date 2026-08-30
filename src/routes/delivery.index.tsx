import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader, Stars } from "@/components/PageHeader";
import { restaurants, brl } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/delivery/")({
  head: () => ({
    meta: [
      { title: "Delivery em Ipanema | Ipa+" },
      { name: "description", content: "Lanchonetes, pizzarias e marmitas da cidade com entrega rápida pelo Ipa+." },
      { property: "og:title", content: "Delivery em Ipanema | Ipa+" },
      { property: "og:description", content: "Peça comida dos restaurantes locais direto pelo Ipa+." },
    ],
  }),
  component: DeliveryList,
});

function DeliveryList() {
  const { cartCount } = useStore();

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Delivery"
        subtitle="Alimentação na sua porta"
        right={
          <Link to="/carrinho" className="relative grid size-9 place-items-center rounded-full bg-secondary-foreground/10">
            <ShoppingBag className="size-4.5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        }
      />
      <main className="mx-auto max-w-md space-y-3 px-4 pt-4">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            to="/delivery/$restaurantId"
            params={{ restaurantId: r.id }}
            className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
          >
            <div className="grid size-20 shrink-0 place-items-center rounded-xl accent-soft text-3xl">{r.emoji}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-bold">{r.name}</p>
                <Stars rating={r.rating} />
              </div>
              <p className="text-xs text-muted-foreground">{r.category}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {r.eta} · entrega {brl(r.deliveryFee)}
              </p>
              {r.tag && (
                <span className="mt-2 inline-block rounded-full accent-soft px-2 py-0.5 text-[10px] font-bold text-primary">
                  {r.tag}
                </span>
              )}
            </div>
          </Link>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
