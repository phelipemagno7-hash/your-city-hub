import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { brl } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho | Ipa+" },
      { name: "description", content: "Revise os itens do seu pedido antes de finalizar a compra no Ipa+." },
      { property: "og:title", content: "Carrinho | Ipa+" },
      { property: "og:description", content: "Revise os itens do seu pedido de delivery." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, changeQty, cartTotal, clearCart } = useStore();
  const fee = cart.length ? 6 : 0;

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="Carrinho" subtitle={cart[0]?.restaurantName ?? "Nenhum item"} back="/delivery" />

      <main className="mx-auto max-w-md px-4 pt-4">
        {cart.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <p className="text-4xl">🛒</p>
            <p className="mt-3 font-bold">Seu carrinho está vazio</p>
            <p className="mt-1 text-xs text-muted-foreground">Escolha um restaurante e monte seu pedido.</p>
            <Link
              to="/delivery"
              className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Ver restaurantes
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cart.map((l) => (
                <div key={l.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl accent-soft text-xl">{l.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{l.name}</p>
                    <p className="text-sm font-bold text-primary">{brl(l.price * l.qty)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 rounded-full border border-border px-2 py-1">
                    <button aria-label="Diminuir" onClick={() => changeQty(l.id, -1)} className="text-primary">
                      {l.qty === 1 ? <Trash2 className="size-4" /> : <Minus className="size-4" />}
                    </button>
                    <span className="w-4 text-center text-sm font-bold">{l.qty}</span>
                    <button aria-label="Aumentar" onClick={() => changeQty(l.id, 1)} className="text-primary">
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-card p-4 text-sm shadow-card">
              <Row label="Subtotal" value={brl(cartTotal)} />
              <Row label="Taxa de entrega" value={brl(fee)} />
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{brl(cartTotal + fee)}</span>
              </div>
            </div>

            <button onClick={clearCart} className="mt-3 w-full text-xs font-semibold text-muted-foreground">
              Esvaziar carrinho
            </button>

            <div className="fixed inset-x-0 bottom-0 bg-background/80 p-4 backdrop-blur">
              <Link
                to="/checkout"
                className="mx-auto flex max-w-md items-center justify-center rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-card"
              >
                Ir para o pagamento
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1 text-muted-foreground">
      <span>{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
