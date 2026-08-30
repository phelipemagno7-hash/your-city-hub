import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { products, brl } from "@/lib/data";

export const Route = createFileRoute("/vitrine")({
  head: () => ({
    meta: [
      { title: "Vitrine Virtual | Lojas locais no Ipa+" },
      {
        name: "description",
        content: "Catálogo de roupas, calçados, casa e variedades das lojas da cidade. Fale direto com o vendedor.",
      },
      { property: "og:title", content: "Vitrine Virtual | Lojas locais no Ipa+" },
      { property: "og:description", content: "Produtos das lojas locais com atendimento pelo WhatsApp." },
    ],
  }),
  component: Vitrine,
});

const categories = ["Todos", "Moda", "Calçados", "Casa", "Beleza", "Esporte"];

function Vitrine() {
  const [active, setActive] = useState("Todos");
  const list = active === "Todos" ? products : products.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Vitrine Virtual" subtitle="Lojas da cidade" />

      <main className="mx-auto max-w-md px-4 pt-4">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                active === c ? "bg-primary text-primary-foreground" : "accent-soft text-foreground/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {list.map((p) => (
            <article key={p.id} className="flex flex-col rounded-2xl border border-border bg-card p-3 shadow-card">
              <div className="grid h-28 place-items-center rounded-xl accent-soft text-4xl">{p.emoji}</div>
              <p className="mt-2 text-sm font-bold leading-tight">{p.name}</p>
              <p className="text-[11px] text-muted-foreground">{p.store}</p>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{p.description}</p>
              <p className="mt-2 text-base font-extrabold text-primary">{brl(p.price)}</p>
              <a
                href={`https://wa.me/${p.whatsapp}?text=${encodeURIComponent(`Olá! Vi o produto "${p.name}" no Ipa+ e quero mais informações.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground"
              >
                <MessageCircle className="size-3.5" /> Consultar vendedor
              </a>
            </article>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
