import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  User,
  Store,
  UtensilsCrossed,
  CalendarDays,
  HardHat,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { useStore, demoAccounts, type UserAccount } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar ou Acessar Painel | Ipa+" },
      { name: "description", content: "Acesse sua conta de cliente ou o painel de gestão do seu estabelecimento em Ipanema." },
      { property: "og:title", content: "Entrar ou Acessar Painel | Ipa+" },
      { property: "og:description", content: "Login de clientes e comerciantes do Ipa+." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { currentUser, loginAs, logout } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"customer" | "merchant">(
    currentUser.role === "merchant" ? "merchant" : "customer",
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleQuickLogin = (account: UserAccount) => {
    loginAs(account);
    if (account.role === "merchant") {
      toast.success(`Bem-vindo ao painel do(a) ${account.storeName}!`, {
        description: "Seus dados, pedidos e agendamentos foram carregados de forma 100% isolada.",
      });
      navigate({ to: "/lojista" });
    } else {
      toast.success(`Olá, ${account.name}! Login de cliente realizado.`);
      navigate({ to: "/" });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (activeTab === "merchant") {
      // Demo merchant login
      const matched = demoAccounts.find((a) => a.role === "merchant" && a.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        handleQuickLogin(matched);
      } else {
        // Fallback default merchant
        handleQuickLogin(demoAccounts[1]!);
      }
    } else {
      // Customer login
      handleQuickLogin(demoAccounts[0]!);
    }
  };

  const merchantAccounts = demoAccounts.filter((a) => a.role === "merchant");
  const customerAccounts = demoAccounts.filter((a) => a.role === "customer");

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="size-4" /> Voltar para o início
        </Link>

        {/* Current Active Session Card */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="grid size-12 place-items-center rounded-2xl accent-soft text-2xl shrink-0">
              {currentUser.emoji || "👤"}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sessão Atual:</span>
                <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[10px] font-black">
                  {currentUser.role === "merchant" ? "Lojista / Parceiro" : "Cliente"}
                </span>
              </div>
              <p className="font-extrabold text-base text-foreground">
                {currentUser.name} {currentUser.storeName && `(${currentUser.storeName})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.role === "merchant" ? (
              <Link
                to="/lojista"
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-xs font-bold transition-colors shadow-sm"
              >
                Ir para o Meu Painel
              </Link>
            ) : (
              <Link
                to="/"
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-xs font-bold transition-colors shadow-sm"
              >
                Comprar no App
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                toast.info("Desconectado da conta atual.");
              }}
              className="rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground px-3 py-2 text-xs font-semibold transition-colors"
            >
              Trocar Conta
            </button>
          </div>
        </div>

        {/* Login Tabs */}
        <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
            <Sparkles className="size-3.5" />
            <span>Sistema Multi-Contas com Isolamento Total</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Acesse sua Conta</h1>
          <p className="text-xs text-muted-foreground">
            Escolha seu tipo de perfil para acessar seus dados com total privacidade
          </p>

          <div className="pt-4 flex rounded-2xl bg-card border border-border p-1.5 max-w-xs mx-auto">
            <button
              onClick={() => setActiveTab("customer")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "customer"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="size-3.5" />
              <span>Sou Cliente</span>
            </button>
            <button
              onClick={() => setActiveTab("merchant")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "merchant"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Store className="size-3.5" />
              <span>Sou Lojista</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SOU LOJISTA / PARCEIRO */}
        {activeTab === "merchant" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
              <div className="border-b border-border pb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" /> Selecione seu Estabelecimento (Login Rápido de Demonstração)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cada estabelecimento possui painel, cardápio, horários e pedidos 100% isolados uns dos outros.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {merchantAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => handleQuickLogin(acc)}
                    className={`p-4 rounded-2xl border text-left transition-all hover:scale-102 flex flex-col justify-between space-y-3 ${
                      currentUser.id === acc.id
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-md"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid size-11 place-items-center rounded-xl accent-soft text-2xl shrink-0">
                        {acc.emoji}
                      </span>
                      <div className="min-w-0">
                        <span className="font-extrabold text-sm text-foreground block truncate">{acc.storeName}</span>
                        <span className="text-[11px] font-bold text-primary block truncate">{acc.storeCategory}</span>
                        <span className="text-[10px] text-muted-foreground block truncate mt-0.5">{acc.name}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary">
                      <span>{currentUser.id === acc.id ? "Conta Ativa" : "Entrar como Lojista"}</span>
                      <ArrowRight className="size-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Traditional Form Option */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card max-w-md mx-auto space-y-4">
              <h3 className="text-sm font-bold text-foreground text-center">Ou faça login com e-mail e senha</h3>
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">E-mail do Estabelecimento</label>
                  <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2.5">
                    <Mail className="size-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ex: contato@burgerdapraca.com"
                      className="w-full bg-transparent text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Senha de Acesso</label>
                  <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2.5">
                    <Lock className="size-4 text-muted-foreground" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-xs outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-xs font-bold transition-colors shadow-md mt-2"
                >
                  Entrar no Painel do Lojista
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: SOU CLIENTE */}
        {activeTab === "customer" && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-base font-bold text-foreground">Entrar como Consumidor</h2>
                <p className="text-xs text-muted-foreground">
                  Acompanhe seus pedidos, endereços e horários agendados
                </p>
              </div>

              {/* Quick Customer login */}
              <button
                onClick={() => handleQuickLogin(customerAccounts[0]!)}
                className="w-full p-4 rounded-2xl border border-primary bg-primary/5 hover:bg-primary/10 transition-all flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl accent-soft text-xl font-black text-primary">
                    PM
                  </span>
                  <div>
                    <span className="font-bold text-sm text-foreground block">Phelipe Magno</span>
                    <span className="text-xs text-muted-foreground block">phelipe@email.com</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  Acessar <ArrowRight className="size-3.5" />
                </span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground text-[10px] font-bold">Ou entre com outra conta</span>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Senha</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-xs font-bold transition-colors shadow-md mt-2"
                >
                  Entrar como Cliente
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
