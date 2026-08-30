import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronLeft, AlertTriangle, Ban } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { brl } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho de Compras | Ipa+" },
      { name: "description", content: "Revise os itens do seu pedido antes de finalizar a compra no Ipa+." },
      { property: "og:title", content: "Carrinho de Compras | Ipa+" },
      { property: "og:description", content: "Revise os itens do seu pedido de delivery em Ipanema." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, changeQty, cartTotal, clearCart, isItemPaused } = useStore();
  const fee = cart.length ? 6 : 0;

  const pausedItemsInCart = cart.filter((l) => isItemPaused(l.id));
  const hasPausedItems = pausedItemsInCart.length > 0;

  const removeAllPausedItems = () => {
    pausedItemsInCart.forEach((item) => {
      changeQty(item.id, -item.qty);
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        <Link
          to="/delivery"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ChevronLeft className="size-4" /> Continuar comprando
        </Link>

        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2">
              <ShoppingBag className="size-7 text-primary" /> Meu Carrinho
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {cart.length > 0 ? `Pedido em ${cart[0]?.restaurantName}` : "Nenhum item adicionado"}
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
            >
              Esvaziar carrinho
            </button>
          )}
        </div>

        {/* ALERTA DE ITENS PAUSADOS / ESGOTADOS */}
        {hasPausedItems && (
          <div className="mt-6 rounded-3xl border border-red-300 bg-red-50 p-5 text-red-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Atenção: Há itens esgotados no seu carrinho</p>
                <p className="text-xs text-red-800/90 mt-0.5">
                  O estabelecimento pausou{" "}
                  <strong>{pausedItemsInCart.map((i) => i.name).join(", ")}</strong> porque os ingredientes/estoque
                  acabaram.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeAllPausedItems}
              className="shrink-0 rounded-2xl bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-xs font-bold transition-colors shadow-sm"
            >
              Remover itens esgotados
            </button>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-card max-w-lg mx-auto">
            <p className="text-5xl">🛒</p>
            <h2 className="mt-4 text-lg font-bold text-foreground">Seu carrinho está vazio</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Explore nossos restaurantes e monte seu pedido com entrega rápida.
            </p>
            <Link
              to="/delivery"
              className="mt-6 inline-flex rounded-2xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
            >
              Ver Restaurantes
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items (Left Column) */}
            <div className="lg:col-span-7 space-y-4">
              {cart.map((l) => {
                const isPaused = isItemPaused(l.id);

                return (
                  <div
                    key={l.id}
                    className={`flex items-center justify-between gap-4 rounded-2xl border p-4 shadow-card transition-all ${
                      isPaused ? "border-red-300 bg-red-50/40" : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid size-14 shrink-0 place-items-center rounded-xl accent-soft text-2xl">
                        {l.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-bold text-foreground">{l.name}</p>
                          {isPaused && (
                            <span className="rounded-full bg-red-100 text-red-800 px-2 py-0.5 text-[10px] font-extrabold flex items-center gap-1 shrink-0">
                              <Ban className="size-3" /> Esgotado
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{brl(l.price)} unid.</p>
                        <p className="text-sm font-extrabold text-primary sm:hidden mt-1">
                          {brl(l.price * l.qty)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <p className="hidden sm:block text-sm font-extrabold text-primary">
                        {brl(l.price * l.qty)}
                      </p>
                      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1">
                        <button
                          aria-label="Diminuir quantidade"
                          onClick={() => changeQty(l.id, -1)}
                          className="text-primary hover:text-destructive transition-colors"
                        >
                          {l.qty === 1 ? <Trash2 className="size-4" /> : <Minus className="size-4" />}
                        </button>
                        <span className="w-4 text-center text-xs font-bold">{l.qty}</span>
                        <button
                          aria-label="Aumentar quantidade"
                          disabled={isPaused}
                          onClick={() => {
                            if (!isPaused) changeQty(l.id, 1);
                          }}
                          className={`transition-colors ${
                            isPaused ? "text-muted-foreground opacity-30 cursor-not-allowed" : "text-primary"
                          }`}
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary (Right Column) */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
                <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
                  Resumo dos Valores
                </h2>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal dos itens</span>
                    <span className="font-semibold text-foreground">{brl(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxa de entrega</span>
                    <span className="font-semibold text-foreground">{brl(fee)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-foreground border-t border-border pt-3">
                    <span>Total a pagar</span>
                    <span className="text-primary text-lg">{brl(cartTotal + fee)}</span>
                  </div>
                </div>

                {hasPausedItems ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-muted text-muted-foreground py-3.5 text-xs font-bold cursor-not-allowed opacity-80"
                    >
                      <span>Remova os itens esgotados</span>
                    </button>
                    <p className="text-[11px] text-center text-red-600 font-semibold">
                      Não é possível finalizar a compra com itens esgotados no carrinho.
                    </p>
                  </div>
                ) : (
                  <Link
                    to="/checkout"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-102"
                  >
                    <span>Ir para o Pagamento</span>
                    <ArrowRight className="size-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
