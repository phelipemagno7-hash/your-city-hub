import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, MapPin, HardHat, Search } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { professionals } from "@/lib/data";

export const Route = createFileRoute("/profissionais")({
  head: () => ({
    meta: [
      { title: "Profissionais e Serviços em Ipanema | Ipa+" },
      {
        name: "description",
        content: "Encontre pedreiros, eletricistas, diaristas, pintores e outros profissionais autônomos de Ipanema com avaliações.",
      },
      { property: "og:title", content: "Profissionais e Serviços em Ipanema | Ipa+" },
      { property: "og:description", content: "Classificados de profissionais autônomos da cidade com contato direto." },
    ],
  }),
  component: Profissionais,
});

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Avaliação ${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? "text-amber-500 font-bold" : "text-border"}>
          ★
        </span>
      ))}
    </span>
  );
}

function Profissionais() {
  const [q, setQ] = useState("");
  const list = professionals.filter((p) =>
    `${p.name} ${p.specialty} ${p.about} ${p.area}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
              <HardHat className="size-7 text-primary" /> Profissionais Autônomos
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Classificados locais de prestadores de serviços de confiança em Ipanema
            </p>
          </div>

          <div className="w-full sm:w-80 flex items-center gap-2 rounded-2xl border border-input bg-card px-3.5 py-2.5 shadow-sm">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por pedreiro, eletricista, nome..."
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Quick specialty tags */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="text-muted-foreground self-center font-medium">Especialidades:</span>
          {["Pedreiro", "Eletricista", "Diarista", "Encanador", "Pintora", "Marceneiro"].map((spec) => (
            <button
              key={spec}
              onClick={() => setQ(spec)}
              className={`rounded-full px-3 py-1 transition-colors ${
                q.toLowerCase() === spec.toLowerCase()
                  ? "bg-primary text-primary-foreground font-bold"
                  : "accent-soft text-foreground/80 hover:bg-accent/40"
              }`}
            >
              {spec}
            </button>
          ))}
          {q && (
            <button
              onClick={() => setQ("")}
              className="text-xs text-muted-foreground hover:text-foreground underline ml-2"
            >
              Limpar busca
            </button>
          )}
        </div>

        {/* List Grid */}
        {list.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border mt-8 bg-card">
            <p className="text-4xl">🛠️</p>
            <h2 className="mt-3 font-bold text-base">Nenhum profissional encontrado</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Tente buscar por outro termo ou especialidade.
            </p>
            <button
              onClick={() => setQ("")}
              className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              Ver todos os profissionais
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <div className="grid size-16 shrink-0 place-items-center rounded-2xl accent-soft text-lg font-black text-primary group-hover:scale-105 transition-transform">
                      {p.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {p.name}
                      </h2>
                      <p className="text-xs font-bold text-primary">{p.specialty}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <StarRow rating={p.rating} />
                        <span className="font-semibold text-foreground">
                          {p.rating.toFixed(1)}
                        </span>
                        <span>({p.reviews} avaliações)</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                    {p.about}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 text-primary shrink-0" />
                    <span>Atende: {p.area}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 grid grid-cols-2 gap-3">
                  <a
                    href={`tel:+${p.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background hover:bg-accent/20 px-3 py-2.5 text-xs font-bold text-foreground transition-colors"
                  >
                    <Phone className="size-3.5 text-primary" /> Ligar
                  </a>
                  <a
                    href={`https://wa.me/${p.phone}?text=${encodeURIComponent(`Olá ${p.name}, encontrei seu perfil no portal Ipa+ e gostaria de solicitar um orçamento.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 px-3 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:scale-102 shadow-sm"
                  >
                    <MessageCircle className="size-3.5" /> WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
