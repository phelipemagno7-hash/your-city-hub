import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CreditCard, QrCode, Banknote } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { brl } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Ipa+" },
      { name: "description", content: "Confirme endereço e forma de pagamento (cartão, PIX ou dinheiro) do seu pedido." },
      { property: "og:title", content: "Checkout | Ipa+" },
      { property: "og:description", content: "Finalize seu pedido de delivery no Ipa+." },
    ],
  }),
  component: Checkout,
});

type Method = "cartao" | "pix" | "dinheiro";

function Checkout() {
  const { cart, cartTotal, clearCart, addOrder } = useStore();
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("pix");
  const fee = cart.length ? 6 : 0;
  const total = cartTotal + fee;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder({
      type: "delivery",
      title: cart[0]?.restaurantName ?? "Pedido",
      subtitle: `${cart.reduce((s, l) => s + l.qty, 0)} itens · ${method === "pix" ? "PIX" : method === "cartao" ? "Cartão" : "Dinheiro"}`,
      total,
      status: "Em preparo",
    });
    clearCart();
    navigate({ to: "/pedidos" });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="Pagamento" subtitle="Revise e confirme" back="/carrinho" />

      <form onSubmit={submit} className="mx-auto max-w-md space-y-5 px-4 pt-4">
        <Card title="Endereço de entrega">
          <Field label="Rua e número" placeholder="Rua Sete de Setembro, 120" required />
          <Field label="Bairro" placeholder="Centro" required />
          <Field label="Complemento / referência" placeholder="Perto da praça" />
        </Card>

        <Card title="Forma de pagamento">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "pix", label: "PIX", icon: QrCode },
              { id: "cartao", label: "Cartão", icon: CreditCard },
              { id: "dinheiro", label: "Dinheiro", icon: Banknote },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id as Method)}
                className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold transition-colors ${
                  method === id ? "border-primary accent-soft text-primary" : "border-border bg-card text-muted-foreground"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          {method === "cartao" && (
            <div className="mt-4 space-y-3">
              <Field label="Número do cartão" placeholder="0000 0000 0000 0000" inputMode="numeric" />
              <Field label="Nome impresso" placeholder="Como está no cartão" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Validade" placeholder="MM/AA" />
                <Field label="CVV" placeholder="123" inputMode="numeric" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Formulário preparado para integração futura com gateway de pagamento.
              </p>
            </div>
          )}

          {method === "pix" && (
            <div className="mt-4 rounded-xl accent-soft p-4 text-center">
              <QrCode className="mx-auto size-12 text-primary" />
              <p className="mt-2 text-xs text-foreground/70">
                O QR Code do PIX será gerado após a confirmação do pedido.
              </p>
            </div>
          )}

          {method === "dinheiro" && (
            <div className="mt-4">
              <Field label="Troco para" placeholder="R$ 50,00" inputMode="numeric" />
            </div>
          )}
        </Card>

        <Card title="Resumo">
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">{brl(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Entrega</span>
              <span className="font-semibold text-foreground">{brl(fee)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
              <span>Total</span>
              <span className="text-primary">{brl(total)}</span>
            </div>
          </div>
        </Card>

        <div className="fixed inset-x-0 bottom-0 bg-background/80 p-4 backdrop-blur">
          <button
            type="submit"
            disabled={cart.length === 0}
            className="mx-auto flex w-full max-w-md items-center justify-center rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-card disabled:opacity-50"
          >
            Confirmar pedido · {brl(total)}
          </button>
        </div>
      </form>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <h2 className="mb-3 text-sm font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="mb-3 block last:mb-0">
      <span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
