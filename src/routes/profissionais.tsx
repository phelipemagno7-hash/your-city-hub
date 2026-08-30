import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { professionals } from "@/lib/data";

export const Route = createFileRoute("/profissionais")({
  head: () => ({
    meta: [
      { title: "Profissionais e Serviços | Ipa+" },
      {
        name: "description",
        content: "Encontre pedreiros, eletricistas, diaristas e outros profissionais autônomos da cidade com avaliações.",
      },
      { property: "og:title", content: "Profissionais e Serviços | Ipa+" },
      { property: "og:description", content: "Classificados de profissionais autônomos com contato direto." },
    ],
  }),
  component: Profissionais,
});

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Avaliação ${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? "text-star" : "text-border"}>
          ★
        </span>
      ))}
    </span>
  );
}

function Profissionais() {
  const [q, setQ] = useState("");
  const list = professionals.filter((p) =>
    `${p.name} ${p.specialty}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Profissionais" subtitle="Serviços gerais da cidade" />

      <main className="mx-auto max-w-md px-4 pt-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome ou especialidade"
          className="mb-4 w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />

        <div className="space-y-3">
          {list.map((p) => (
            <article key={p.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex gap-3">
                <div className="grid size-14 shrink-0 place-items-center rounded-full accent-soft text-base font-extrabold text-primary">
                  {p.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{p.name}</p>
                  <p className="text-xs font-semibold text-primary">{p.specialty}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    <StarRow rating={p.rating} />{" "}
                    <span className="align-middle">
                      {p.rating.toFixed(1)} · {p.reviews} avaliações
                    </span>
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{p.about}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="size-3.5" /> {p.area}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={`tel:+${p.phone}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary px-3 py-2 text-xs font-bold text-primary"
                >
                  <Phone className="size-3.5" /> Ligar
                </a>
                <a
                  href={`https://wa.me/${p.phone}?text=${encodeURIComponent(`Olá ${p.name}, encontrei seu perfil no Ipa+ e preciso de um orçamento.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
                >
                  <MessageCircle className="size-3.5" /> WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
