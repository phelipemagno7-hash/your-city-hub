import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Plus, Minus, Trash2, ShoppingBag, Clock, ChevronLeft, ArrowRight, Ban } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
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
    const desc = `Cardápio e preços de ${restaurant.name} com entrega em ${restaurant.eta} em Ipanema.`;
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
  const { cart, addToCart, changeQty, clearCart, cartCount, cartTotal, isItemPaused } = useStore();
  const fee = restaurant.deliveryFee;
  const isCurrentRestaurantInCart = cart[0]?.restaurantId === restaurant.id;
  const restaurantCart = isCurrentRestaurantInCart ? cart : [];

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-6">
        {/* Back Link */}
        <Link
          to="/delivery"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ChevronLeft className="size-4" /> Voltar para lista de restaurantes
        </Link>

        {/* Restaurant Profile Banner */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="grid size-24 shrink-0 place-items-center rounded-2xl accent-soft text-5xl shadow-sm">
            {restaurant.emoji}
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">{restaurant.name}</h1>
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg">
                ★ {restaurant.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm font-semibold text-primary">{restaurant.category}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-primary" /> Tempo estimado: {restaurant.eta}
              </span>
              <span>•</span>
              <span>Taxa de entrega: {restaurant.deliveryFee === 0 ? "Grátis" : brl(restaurant.deliveryFee)}</span>
            </div>
            {restaurant.tag && (
              <div className="pt-2">
                <span className="inline-block rounded-full accent-soft px-3 py-1 text-[11px] font-bold text-primary">
                  {restaurant.tag}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Menu Sections (Left Column) */}
          <div className="lg:col-span-8 space-y-8">
            {restaurant.menu.map((section) => (
              <section key={section.section} className="space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-foreground border-b border-border pb-2">
                  {section.section}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.items.map((item) => {
                    const isPaused = isItemPaused(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col justify-between rounded-2xl border p-4 shadow-card transition-all ${
                          isPaused
                            ? "border-border/60 bg-muted/30 opacity-65"
                            : "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="grid size-16 shrink-0 place-items-center rounded-xl accent-soft text-3xl">
                            {item.emoji}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h3 className="font-bold text-sm text-foreground truncate">{item.name}</h3>
                              {isPaused && (
                                <span className="rounded-full bg-red-100 text-red-800 px-2 py-0.5 text-[9px] font-extrabold shrink-0">
                                  Esgotado
                                </span>
                              )}
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                          <span className="text-base font-extrabold text-primary">{brl(item.price)}</span>
                          <button
                            type="button"
                            disabled={isPaused}
                            aria-label={`Adicionar ${item.name}`}
                            onClick={() => {
                              if (isPaused) return;
                              addToCart({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                emoji: item.emoji,
                                restaurantId: restaurant.id,
                                restaurantName: restaurant.name,
                              });
                            }}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                              isPaused
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-sm"
                            }`}
                          >
                            {isPaused ? (
                              <>
                                <Ban className="size-3" /> Esgotado
                              </>
                            ) : (
                              <>
                                <Plus className="size-3.5" /> Adicionar
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Desktop Sticky Cart Sidebar (Right Column) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <ShoppingBag className="size-5 text-primary" /> Seu Pedido
                </h3>
                {restaurantCart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] font-semibold text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Esvaziar
                  </button>
                )}
              </div>

              {restaurantCart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl">🛒</p>
                  <p className="mt-2 text-xs font-bold text-foreground">Seu carrinho está vazio</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Adicione itens do cardápio ao lado.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {restaurantCart.map((l) => (
                      <div key={l.id} className="flex items-center justify-between gap-2 text-xs">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground truncate">{l.name}</p>
                          <p className="text-muted-foreground">{brl(l.price * l.qty)}</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                          <button
                            aria-label="Diminuir"
                            onClick={() => changeQty(l.id, -1)}
                            className="text-primary hover:text-destructive"
                          >
                            {l.qty === 1 ? <Trash2 className="size-3.5" /> : <Minus className="size-3.5" />}
                          </button>
                          <span className="w-3 text-center font-bold">{l.qty}</span>
                          <button
                            aria-label="Aumentar"
                            onClick={() => changeQty(l.id, 1)}
                            className="text-primary"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-semibold text-foreground">{brl(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Taxa de entrega</span>
                      <span className="font-semibold text-foreground">{fee === 0 ? "Grátis" : brl(fee)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-foreground border-t border-border pt-2">
                      <span>Total</span>
                      <span className="text-primary">{brl(cartTotal + fee)}</span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
                  >
                    <span>Finalizar Pedido</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Floating Cart Bar */}
      {cartCount > 0 && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background/90 p-4 backdrop-blur border-t border-border">
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

      <Footer />
      <BottomNav />
    </div>
  );
}
