import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Plus, ShoppingBag } from "lucide-react";
import { PageHeader, Stars } from "@/components/PageHeader";
import { restaurants, brl } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/delivery/$restaurantId")({
  loader: ({ params }) => {
    const restaurant = restaurants.find((r) => r.id === params.restaurantId);
    if (!restaurant) throw notFound();
    return { restaurant };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Restaurante indisponível | Ipa+" }, { name: "robots", content: "noindex" }] };
    }
    const { restaurant } = loaderData;
    const desc = `Cardápio e preços de ${restaurant.name} com entrega em ${restaurant.eta}.`;
    return {
      meta: [
        { title: `${restaurant.name} | Delivery Ipa+` },
        { name: "description", content: desc },
        { property: "og:title", content: `${restaurant.name} | Delivery Ipa+` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: RestaurantPage,
});

function RestaurantPage() {
  const { restaurant } = Route.useLoaderData();
  const { addToCart, cartCount, cartTotal } = useStore();

  return (
    <div className="min-h-screen bg-background pb-28">
      <PageHeader title={restaurant.name} subtitle={restaurant.category} back="/delivery" />

      <div className="mx-auto max-w-md px-4">
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="grid size-16 shrink-0 place-items-center rounded-xl accent-soft text-3xl">
            {restaurant.emoji}
          </div>
          <div className="min-w-0 text-xs text-muted-foreground">
            <Stars rating={restaurant.rating} />
            <p className="mt-1">Entrega em {restaurant.eta}</p>
            <p>Taxa de entrega {brl(restaurant.deliveryFee)}</p>
          </div>
        </div>

        {restaurant.menu.map((section) => (
          <section key={section.section} className="mt-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              {section.section}
            </h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
                  <div className="grid size-16 shrink-0 place-items-center rounded-xl accent-soft text-2xl">
                    {item.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                    <p className="mt-1 font-bold text-primary">{brl(item.price)}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Adicionar ${item.name}`}
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        emoji: item.emoji,
                        restaurantId: restaurant.id,
                        restaurantName: restaurant.name,
                      })
                    }
                    className="grid size-9 shrink-0 self-center place-items-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-background/80 p-4 backdrop-blur">
          <Link
            to="/carrinho"
            className="mx-auto flex max-w-md items-center justify-between rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-card"
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="size-4" /> Ver carrinho ({cartCount})
            </span>
            <span>{brl(cartTotal)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
