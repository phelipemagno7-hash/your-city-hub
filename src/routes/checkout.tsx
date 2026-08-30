import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { CreditCard, QrCode, Banknote, ShieldCheck, ChevronLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { brl } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar Pedido | Ipa+" },
      { name: "description", content: "Confirme endereço e forma de pagamento (cartão, PIX ou dinheiro) do seu pedido." },
      { property: "og:title", content: "Finalizar Pedido | Ipa+" },
      { property: "og:description", content: "Finalize seu pedido de delivery no Ipa+." },
    ],
  }),
  component: Checkout,
});

type Method = "pix" | "cartao" | "dinheiro";

function Checkout() {
  const { cart, cartTotal, clearCart, addOrder } = useStore();
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("pix");
  const fee = cart.length ? 6 : 0;
  const total = cartTotal + fee;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    addOrder({
      type: "delivery",
      title: cart[0]?.restaurantName ?? "Pedido Delivery",
      subtitle: `${cart.reduce((s, l) => s + l.qty, 0)} itens · ${method === "pix" ? "PIX" : method === "cartao" ? "Cartão" : "Dinheiro"}`,
      total,
      status: "Em preparo",
    });
    clearCart();
    navigate({ to: "/pedidos" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        <Link
          to="/carrinho"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ChevronLeft className="size-4" /> Voltar para o carrinho
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-foreground pb-4 border-b border-border">
          Finalização do Pedido
        </h1>

        {cart.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-card max-w-lg mx-auto">
            <p className="text-5xl">🛒</p>
            <h2 className="mt-4 text-lg font-bold text-foreground">Nenhum item para checkout</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Seu carrinho está vazio. Adicione itens antes de finalizar.
            </p>
            <Link
              to="/delivery"
              className="mt-6 inline-flex rounded-2xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground"
            >
              Ir para o Delivery
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Forms Column (Left) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Address Card */}
              <section className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary text-xs">1</span>
                  Endereço de Entrega
                </h2>
                
                <div className="space-y-3">
                  <Field label="Rua e número" placeholder="Ex: Rua Sete de Setembro, 120" required defaultValue="Rua Sete de Setembro, 120" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Bairro" placeholder="Ex: Centro" required defaultValue="Centro" />
                    <Field label="Cidade" placeholder="Ipanema" defaultValue="Ipanema — MG" disabled />
                  </div>
                  <Field label="Ponto de referência / Complemento" placeholder="Ex: Próximo à praça central, Apto 101" />
                </div>
              </section>

              {/* Payment Method Card */}
              <section className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary text-xs">2</span>
                  Forma de Pagamento
                </h2>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "pix", label: "PIX", icon: QrCode, desc: "Aprovação instantânea" },
                    { id: "cartao", label: "Cartão", icon: CreditCard, desc: "Crédito ou débito" },
                    { id: "dinheiro", label: "Dinheiro", icon: Banknote, desc: "Pague na entrega" },
                  ].map(({ id, label, icon: Icon, desc }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setMethod(id as Method)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                        method === id
                          ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <Icon className="size-5 mb-1.5" />
                      <span className="text-xs font-bold text-foreground">{label}</span>
                      <span className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">{desc}</span>
                    </button>
                  ))}
                </div>

                {method === "cartao" && (
                  <div className="mt-4 p-4 rounded-2xl border border-border/80 bg-background/50 space-y-3">
                    <Field label="Número do cartão" placeholder="0000 0000 0000 0000" inputMode="numeric" />
                    <Field label="Nome impresso no cartão" placeholder="Ex: NOME SOBRENOME" />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Validade" placeholder="MM/AA" />
                      <Field label="CVV" placeholder="123" inputMode="numeric" />
                    </div>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <ShieldCheck className="size-3.5 text-primary" /> Formulário seguro preparado para transações com criptografia.
                    </p>
                  </div>
                )}

                {method === "pix" && (
                  <div className="mt-4 rounded-2xl accent-soft p-5 text-center space-y-2">
                    <QrCode className="mx-auto size-12 text-primary" />
                    <p className="text-xs font-bold text-foreground">Pagamento via PIX</p>
                    <p className="text-xs text-foreground/75 max-w-sm mx-auto">
                      A chave PIX e o QR Code serão exibidos assim que você confirmar o pedido.
                    </p>
                  </div>
                )}

                {method === "dinheiro" && (
                  <div className="mt-4 p-4 rounded-2xl border border-border bg-background/50 space-y-2">
                    <Field label="Precisa de troco para quanto?" placeholder="Ex: R$ 50,00 ou R$ 100,00" inputMode="numeric" />
                  </div>
                )}
              </section>
            </div>

            {/* Summary Column (Right) */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
                <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
                  Resumo do Pedido
                </h2>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((l) => (
                    <div key={l.id} className="flex items-center justify-between text-xs">
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-foreground">{l.qty}x {l.name}</span>
                      </div>
                      <span className="text-muted-foreground font-medium shrink-0 ml-2">
                        {brl(l.price * l.qty)}
                      </span>
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
                    <span className="font-semibold text-foreground">{brl(fee)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-foreground border-t border-border pt-3">
                    <span>Total a pagar</span>
                    <span className="text-primary text-xl">{brl(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-extrabold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-102"
                >
                  <CheckCircle2 className="size-5" />
                  <span>Confirmar Pedido · {brl(total)}</span>
                </button>

                <p className="text-[11px] text-center text-muted-foreground">
                  Ao confirmar, seu pedido será enviado diretamente para a cozinha do estabelecimento.
                </p>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground/80">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60"
      />
    </label>
  );
}
