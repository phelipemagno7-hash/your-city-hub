import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Store,
  UtensilsCrossed,
  CalendarDays,
  HardHat,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Power,
  DollarSign,
  Package,
  Settings,
  ChevronRight,
  Sparkles,
  Search,
  ExternalLink,
  MessageCircle,
  Check,
  X,
  Ban,
  RefreshCw,
  User,
  Phone,
  Calendar,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { brl, places, restaurants } from "@/lib/data";
import { useStore, demoAccounts, type UserAccount } from "@/lib/store";

export const Route = createFileRoute("/lojista")({
  head: () => ({
    meta: [
      { title: "Painel de Gestão do Estabelecimento | Ipa+" },
      {
        name: "description",
        content: "Área exclusiva para comerciantes, lanchonetes, barbearias e prestadores de serviços de Ipanema.",
      },
      { property: "og:title", content: "Painel de Gestão do Estabelecimento | Ipa+" },
      { property: "og:description", content: "Gestão isolada de pedidos, cardápio e agendamentos no Ipa+." },
    ],
  }),
  component: LojistaDashboard,
});

type TabType = "overview" | "orders" | "schedule" | "catalog" | "settings";

// Default schedule slots for salons/barbers
const standardHours = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

function LojistaDashboard() {
  const {
    currentUser,
    loginAs,
    logout,
    updateOrderStatus,
    getStoreOrders,
    getStoreAppointments,
    getStoreItems,
    togglePauseItem,
    addMerchantItem,
    deleteMerchantItem,
    isStoreOpen,
    toggleStoreStatus,
    blockSlot,
    unblockSlot,
    isSlotBlocked,
    addManualAppointment,
    cancelAppointment,
  } = useStore();

  const navigate = useNavigate();

  // If user is a customer, provide instant merchant accounts to select
  const isMerchant = currentUser.role === "merchant" && Boolean(currentUser.storeId);
  const activeStoreId = currentUser.storeId || "burger-da-praca";
  const storeType = currentUser.storeType || "delivery";

  const [activeTab, setActiveTab] = useState<TabType>(
    storeType === "agendamento" ? "schedule" : "overview",
  );

  // Modals & form state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isManualAppointmentModalOpen, setIsManualAppointmentModalOpen] = useState(false);
  const [searchCatalog, setSearchCatalog] = useState("");

  // Schedule date picker
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toLocaleDateString("pt-BR");
  });

  // Manual appointment form state
  const [manualClientName, setManualClientName] = useState("");
  const [manualClientPhone, setManualClientPhone] = useState("");
  const [manualServiceName, setManualServiceName] = useState("Corte masculino");
  const [manualServicePrice, setManualServicePrice] = useState("35.00");
  const [manualHour, setManualHour] = useState("14:00");

  // Product form state
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Lanches");
  const [newItemEmoji, setNewItemEmoji] = useState("🍔");

  // ISOLATED DATA: Only for active store
  const storeOrders = useMemo(
    () => getStoreOrders(activeStoreId),
    [getStoreOrders, activeStoreId],
  );

  const storeAppointments = useMemo(
    () => getStoreAppointments(activeStoreId),
    [getStoreAppointments, activeStoreId],
  );

  const storeItems = useMemo(
    () => getStoreItems(activeStoreId),
    [getStoreItems, activeStoreId],
  );

  const isCurrentStoreOpen = isStoreOpen(activeStoreId);

  // Financial calculations strictly for this store
  const totalRevenue = useMemo(() => {
    if (storeType === "agendamento") {
      return storeAppointments.reduce((sum, a) => sum + a.total, 0);
    }
    return storeOrders.reduce((sum, o) => sum + o.total, 0);
  }, [storeType, storeAppointments, storeOrders]);

  const pendingOrdersCount = useMemo(
    () => storeOrders.filter((o) => o.status === "Em preparo" || o.status === "Saiu para entrega").length,
    [storeOrders],
  );

  // Handlers
  const handleToggleStoreStatus = () => {
    toggleStoreStatus(activeStoreId);
    toast.info(
      isCurrentStoreOpen
        ? `Loja "${currentUser.storeName}" marcada como Fechada.`
        : `Loja "${currentUser.storeName}" aberta para receber clientes!`,
    );
  };

  const handleTogglePauseItem = (id: string, name: string) => {
    const isNowPaused = togglePauseItem(id);
    if (isNowPaused) {
      toast.warning(`"${name}" foi pausado e marcado como esgotado no app.`, {
        description: "Clientes não poderão adicionar ao carrinho até ser reativado.",
      });
    } else {
      toast.success(`"${name}" foi reativado no cardápio com sucesso!`);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;

    addMerchantItem({
      storeId: activeStoreId,
      name: newItemName.trim(),
      description: newItemDesc.trim() || "Item preparado pelo estabelecimento.",
      price: parseFloat(newItemPrice.replace(",", ".")) || 10,
      category: newItemCategory,
      emoji: newItemEmoji || "🍽️",
    });

    toast.success(`Item "${newItemName.trim()}" cadastrado no catálogo!`);
    setNewItemName("");
    setNewItemDesc("");
    setNewItemPrice("");
    setIsProductModalOpen(false);
  };

  const handleCreateManualAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualClientName.trim()) return;

    // Check if slot already booked
    const existing = storeAppointments.find((a) => a.dateStr === selectedDate && a.hour === manualHour);
    if (existing) {
      toast.error(`O horário das ${manualHour} já está ocupado por ${existing.customerName}!`);
      return;
    }

    addManualAppointment({
      storeId: activeStoreId,
      clientName: manualClientName.trim(),
      clientPhone: manualClientPhone.trim() || undefined,
      serviceName: manualServiceName,
      servicePrice: parseFloat(manualServicePrice.replace(",", ".")) || 35,
      dateStr: selectedDate,
      hour: manualHour,
    });

    toast.success(`Agendamento de "${manualClientName}" cadastrado para ${selectedDate} às ${manualHour}!`);
    setManualClientName("");
    setManualClientPhone("");
    setIsManualAppointmentModalOpen(false);
  };

  const handleToggleSlotBlock = (hour: string) => {
    const isBlocked = isSlotBlocked(activeStoreId, selectedDate, hour);
    if (isBlocked) {
      unblockSlot(activeStoreId, selectedDate, hour);
      toast.success(`Horário das ${hour} desbloqueado! Clientes já podem agendar.`);
    } else {
      blockSlot(activeStoreId, selectedDate, hour, "Pausado pelo barbeiro");
      toast.warning(`Horário das ${hour} foi bloqueado no aplicativo.`, {
        description: "Nenhum cliente conseguirá agendar este horário no app.",
      });
    }
  };

  const handleCancelAppointment = (id: string, clientName?: string) => {
    cancelAppointment(id);
    toast.info(`Agendamento de ${clientName || "cliente"} foi cancelado.`);
  };

  // Public route of current store
  const publicStoreUrl = useMemo(() => {
    if (storeType === "delivery") return `/delivery/${activeStoreId}`;
    if (storeType === "agendamento") return `/agendamentos/${activeStoreId.replace("barbearia-ze", "barbearia-do-ze")}`;
    if (storeType === "vitrine") return `/vitrine`;
    return `/profissionais`;
  }, [storeType, activeStoreId]);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Navbar />

      {/* BANNER SE NÃO FOR LOJISTA AUTENTICADO */}
      {!isMerchant && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-4 px-4 text-amber-900">
          <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-xs">Você está logado como Cliente ({currentUser.name})</p>
                <p className="text-[11px] text-amber-800">
                  Para gerenciar pedidos ou agendamentos, entre na conta do seu estabelecimento parceiro.
                </p>
              </div>
            </div>
            <Link
              to="/login"
              className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-xs font-bold transition-colors shrink-0"
            >
              Fazer Login como Lojista
            </Link>
          </div>
        </div>
      )}

      {/* MERCHANT HEADER WITH STRICT STORE CONTEXT */}
      <section className="bg-secondary text-secondary-foreground border-b border-secondary-foreground/15 py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Store Identity */}
            <div className="flex items-center gap-4">
              <div className="grid size-16 place-items-center rounded-2xl bg-card text-4xl shadow-md border border-border/40 shrink-0">
                {currentUser.emoji || "🏢"}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-secondary-foreground">
                    {currentUser.storeName || "Painel do Lojista"}
                  </h1>
                  <button
                    type="button"
                    onClick={handleToggleStoreStatus}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all ${
                      isCurrentStoreOpen
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                    title="Alternar status do estabelecimento"
                  >
                    <Power className="size-3" />
                    <span>{isCurrentStoreOpen ? "Aberto p/ Clientes" : "Fechado Temporariamente"}</span>
                  </button>
                </div>
                <p className="text-xs text-secondary-foreground/75 mt-0.5">
                  {currentUser.storeCategory || "Estabelecimento Parceiro"} · Ipanema, MG · Gestão Isolada
                </p>
              </div>
            </div>

            {/* Actions: View on App & Switch Account */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={publicStoreUrl as any}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 text-xs font-bold shadow-md transition-colors"
              >
                <span>Ver no App</span>
                <ExternalLink className="size-3.5" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-secondary-foreground/20 bg-secondary-foreground/10 hover:bg-secondary-foreground/20 text-secondary-foreground px-4 py-2.5 text-xs font-bold transition-colors"
              >
                <LogOut className="size-3.5" />
                <span>Trocar Loja</span>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs - Tailored by Store Type */}
          <div className="mt-6 flex gap-2 overflow-x-auto border-t border-secondary-foreground/10 pt-4 scrollbar-none">
            {/* Overview Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
                activeTab === "overview"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-secondary-foreground/80 hover:bg-secondary-foreground/10"
              }`}
            >
              <TrendingUp className="size-4" />
              <span>Visão Geral</span>
            </button>

            {/* If Delivery: Orders Tab */}
            {storeType === "delivery" && (
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
                  activeTab === "orders"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-secondary-foreground/80 hover:bg-secondary-foreground/10"
                }`}
              >
                <UtensilsCrossed className="size-4" />
                <span>Pedidos da Cozinha</span>
                {pendingOrdersCount > 0 && (
                  <span className="grid size-5 place-items-center rounded-full bg-accent text-secondary text-[10px] font-black">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>
            )}

            {/* If Appointment: Schedule Tab */}
            {storeType === "agendamento" && (
              <button
                type="button"
                onClick={() => setActiveTab("schedule")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
                  activeTab === "schedule"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-secondary-foreground/80 hover:bg-secondary-foreground/10"
                }`}
              >
                <CalendarDays className="size-4" />
                <span>Agenda & Horários</span>
                {storeAppointments.length > 0 && (
                  <span className="grid size-5 place-items-center rounded-full bg-accent text-secondary text-[10px] font-black">
                    {storeAppointments.length}
                  </span>
                )}
              </button>
            )}

            {/* Catalog / Menu Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("catalog")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
                activeTab === "catalog"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-secondary-foreground/80 hover:bg-secondary-foreground/10"
              }`}
            >
              <Package className="size-4" />
              <span>{storeType === "agendamento" ? "Serviços & Preços" : "Cardápio & Catálogo"}</span>
              <span className="rounded-full bg-secondary-foreground/15 px-2 py-0.5 text-[10px] font-bold">
                {storeItems.length}
              </span>
            </button>

            {/* Settings Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
                activeTab === "settings"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-secondary-foreground/80 hover:bg-secondary-foreground/10"
              }`}
            >
              <Settings className="size-4" />
              <span>Configurações</span>
            </button>
          </div>
        </div>
      </section>

      {/* MAIN BODY CONTAINER */}
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        {/* ================= ABA 1: VISÃO GERAL ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Faturamento Registrado
                  </span>
                  <div className="grid size-9 place-items-center rounded-xl accent-soft text-primary font-bold">
                    <DollarSign className="size-4.5" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">{brl(totalRevenue)}</p>
                <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                  <TrendingUp className="size-3 text-emerald-600" /> Vendas exclusivas deste estabelecimento
                </p>
              </div>

              {storeType === "delivery" && (
                <div className="rounded-3xl border border-border bg-card p-5 shadow-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Pedidos em Aberto
                    </span>
                    <div className="grid size-9 place-items-center rounded-xl accent-soft text-primary font-bold">
                      <Clock className="size-4.5" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-foreground">{pendingOrdersCount}</p>
                  <p className="text-[11px] text-muted-foreground">Na cozinha ou para entrega</p>
                </div>
              )}

              {storeType === "agendamento" && (
                <div className="rounded-3xl border border-border bg-card p-5 shadow-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Agendamentos
                    </span>
                    <div className="grid size-9 place-items-center rounded-xl accent-soft text-primary font-bold">
                      <CalendarDays className="size-4.5" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-foreground">{storeAppointments.length}</p>
                  <p className="text-[11px] text-muted-foreground">Reservas nesta barbearia/salão</p>
                </div>
              )}

              <div className="rounded-3xl border border-border bg-card p-5 shadow-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {storeType === "agendamento" ? "Serviços Cadastrados" : "Itens no Catálogo"}
                  </span>
                  <div className="grid size-9 place-items-center rounded-xl accent-soft text-primary font-bold">
                    <Package className="size-4.5" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">{storeItems.length}</p>
                <p className="text-[11px] text-muted-foreground">
                  {storeItems.filter((i) => i.available).length} ativos para clientes
                </p>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
              <h3 className="font-bold text-base text-foreground">Ações Rápidas do Estabelecimento</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {storeType === "agendamento" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("schedule");
                        setIsManualAppointmentModalOpen(true);
                      }}
                      className="p-4 rounded-2xl border border-primary/40 bg-primary/5 hover:bg-primary/10 transition-all text-left flex items-center gap-3"
                    >
                      <Plus className="size-5 text-primary shrink-0" />
                      <div>
                        <p className="font-bold text-xs text-foreground">Novo Agendamento Manual</p>
                        <p className="text-[10px] text-muted-foreground">Para clientes que ligaram ou vieram no balcão</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("schedule")}
                      className="p-4 rounded-2xl border border-border hover:border-primary/40 transition-all text-left flex items-center gap-3"
                    >
                      <Lock className="size-5 text-primary shrink-0" />
                      <div>
                        <p className="font-bold text-xs text-foreground">Bloquear / Pausar Horário</p>
                        <p className="text-[10px] text-muted-foreground">Marcar horário como indisponível no app</p>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("catalog");
                        setIsProductModalOpen(true);
                      }}
                      className="p-4 rounded-2xl border border-primary/40 bg-primary/5 hover:bg-primary/10 transition-all text-left flex items-center gap-3"
                    >
                      <Plus className="size-5 text-primary shrink-0" />
                      <div>
                        <p className="font-bold text-xs text-foreground">Cadastrar Novo Prato / Item</p>
                        <p className="text-[10px] text-muted-foreground">Adicionar foto, preço e categoria</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("orders")}
                      className="p-4 rounded-2xl border border-border hover:border-primary/40 transition-all text-left flex items-center gap-3"
                    >
                      <UtensilsCrossed className="size-5 text-primary shrink-0" />
                      <div>
                        <p className="font-bold text-xs text-foreground">Ver Pedidos ao Vivo</p>
                        <p className="text-[10px] text-muted-foreground">Avançar pedidos para preparo e entrega</p>
                      </div>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className="p-4 rounded-2xl border border-border hover:border-primary/40 transition-all text-left flex items-center gap-3"
                >
                  <Settings className="size-5 text-primary shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-foreground">Configurações da Empresa</p>
                    <p className="text-[10px] text-muted-foreground">Horários, WhatsApp e dados gerais</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 2: PEDIDOS DA COZINHA (DELIVERY) ================= */}
        {activeTab === "orders" && storeType === "delivery" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                  <UtensilsCrossed className="size-6 text-primary" /> Pedidos da Cozinha · {currentUser.storeName}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Visualização exclusiva dos pedidos feitos pelos clientes para este restaurante
                </p>
              </div>

              <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
                {storeOrders.length} pedidos registrados
              </span>
            </div>

            {storeOrders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto">
                <p className="text-4xl">🍳</p>
                <h3 className="mt-3 font-bold text-base text-foreground">Nenhum pedido ativo no momento</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Novos pedidos feitos pelos clientes para o {currentUser.storeName} surgirão aqui em tempo real.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeOrders.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-3xl border border-border bg-card p-6 shadow-card flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                        <div>
                          <span className="font-black text-base text-foreground">#{o.id}</span>
                          <span className="text-[11px] text-muted-foreground block">
                            {new Date(o.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            o.status === "Concluído"
                              ? "bg-emerald-50 text-emerald-700"
                              : o.status === "Cancelado"
                              ? "bg-red-50 text-red-700"
                              : "accent-soft text-primary"
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-xs">
                        {o.customerName && (
                          <p className="font-bold text-foreground flex items-center gap-1.5">
                            <User className="size-3.5 text-primary" /> Cliente: {o.customerName}
                          </p>
                        )}
                        <p className="text-muted-foreground leading-relaxed">{o.subtitle}</p>
                        <div className="pt-2 flex justify-between items-center text-sm font-extrabold text-foreground border-t border-border/50">
                          <span>Total a Receber:</span>
                          <span className="text-primary text-base">{brl(o.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-border space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {o.status === "Em preparo" && (
                          <button
                            type="button"
                            onClick={() => {
                              updateOrderStatus(o.id, "Saiu para entrega");
                              toast.info(`Pedido #${o.id} despachado para entrega!`);
                            }}
                            className="col-span-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground py-2 text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <Check className="size-4" /> Despachar p/ Entrega
                          </button>
                        )}

                        {o.status === "Saiu para entrega" && (
                          <button
                            type="button"
                            onClick={() => {
                              updateOrderStatus(o.id, "Concluído");
                              toast.success(`Pedido #${o.id} marcado como Concluído!`);
                            }}
                            className="col-span-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="size-4" /> Concluir Pedido
                          </button>
                        )}

                        {o.status !== "Concluído" && o.status !== "Cancelado" && (
                          <button
                            type="button"
                            onClick={() => {
                              updateOrderStatus(o.id, "Cancelado");
                              toast.error(`Pedido #${o.id} cancelado.`);
                            }}
                            className="col-span-2 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 py-1.5 text-xs font-bold transition-colors"
                          >
                            Recusar / Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 3: AGENDA & HORÁRIOS (BARBEARIAS & SALÕES) ================= */}
        {activeTab === "schedule" && storeType === "agendamento" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                  <CalendarDays className="size-6 text-primary" /> Agenda & Horários · {currentUser.storeName}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Gerencie agendamentos, bloqueie horários e adicione clientes manuais
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsManualAppointmentModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 text-xs font-bold shadow-md transition-all hover:scale-102"
                >
                  <Plus className="size-4" />
                  <span>+ Novo Agendamento Manual</span>
                </button>
              </div>
            </div>

            {/* Date Selector */}
            <div className="rounded-3xl border border-border bg-card p-5 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-primary shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Data Selecionada da Agenda:
                  </span>
                  <p className="text-base font-extrabold text-foreground">{selectedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDate(new Date().toLocaleDateString("pt-BR"))}
                  className="rounded-xl border border-border px-3 py-1.5 text-xs font-bold hover:bg-accent/20 transition-colors"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tomorrow = new Date(Date.now() + 86400000);
                    setSelectedDate(tomorrow.toLocaleDateString("pt-BR"));
                  }}
                  className="rounded-xl border border-border px-3 py-1.5 text-xs font-bold hover:bg-accent/20 transition-colors"
                >
                  Amanhã
                </button>
              </div>
            </div>

            {/* Hourly Schedule Table & Control */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-foreground flex items-center justify-between">
                <span>Grade de Horários do Dia ({selectedDate})</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Clique para bloquear/pausar horários ou desmarcar
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {standardHours.map((hour) => {
                  const appointment = storeAppointments.find(
                    (a) => a.dateStr === selectedDate && a.hour === hour,
                  );
                  const isBlocked = isSlotBlocked(activeStoreId, selectedDate, hour);

                  return (
                    <div
                      key={hour}
                      className={`rounded-2xl border p-4 shadow-card flex flex-col justify-between transition-all ${
                        appointment
                          ? "border-emerald-300 bg-emerald-50/40"
                          : isBlocked
                          ? "border-red-300 bg-red-50/50 opacity-80"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-border/60 pb-2">
                          <span className="text-lg font-black text-foreground flex items-center gap-1.5">
                            <Clock className="size-4 text-primary" /> {hour}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                              appointment
                                ? "bg-emerald-100 text-emerald-800"
                                : isBlocked
                                ? "bg-red-100 text-red-800"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {appointment
                              ? "Agendado"
                              : isBlocked
                              ? "Bloqueado / Pausado"
                              : "Livre no App"}
                          </span>
                        </div>

                        <div className="mt-3 text-xs space-y-1">
                          {appointment ? (
                            <>
                              <p className="font-extrabold text-foreground truncate">
                                👤 {appointment.customerName}
                              </p>
                              <p className="text-muted-foreground truncate">{appointment.title.split("·")[1] || "Atendimento"}</p>
                              {appointment.customerPhone && (
                                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <Phone className="size-3 text-primary" /> {appointment.customerPhone}
                                </p>
                              )}
                              <p className="text-xs font-bold text-primary pt-1">
                                Valor: {brl(appointment.total)} {appointment.isManual && "(Manual)"}
                              </p>
                            </>
                          ) : isBlocked ? (
                            <p className="text-xs text-red-800 italic pt-1">
                              ⛔ Horário pausado no app. Nenhum cliente consegue reservar este horário.
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground italic pt-1">
                              ✅ Disponível para agendamento online pelos clientes de Ipanema.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2">
                        {appointment ? (
                          <button
                            type="button"
                            onClick={() => handleCancelAppointment(appointment.id, appointment.customerName)}
                            className="w-full rounded-xl border border-destructive/40 text-destructive hover:bg-destructive/10 py-1.5 text-xs font-bold transition-colors"
                          >
                            Desmarcar / Cancelar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleSlotBlock(hour)}
                            className={`w-full rounded-xl py-1.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              isBlocked
                                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                                : "border border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100"
                            }`}
                          >
                            {isBlocked ? (
                              <>
                                <Unlock className="size-3.5" />
                                <span>Desbloquear Horário</span>
                              </>
                            ) : (
                              <>
                                <Lock className="size-3.5" />
                                <span>Bloquear / Pausar Horário</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MODAL: NOVO AGENDAMENTO MANUAL */}
            {isManualAppointmentModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl max-w-md w-full space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-bold text-base text-foreground">Novo Agendamento Manual</h3>
                    <button
                      type="button"
                      onClick={() => setIsManualAppointmentModalOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateManualAppointment} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">Nome do Cliente *</label>
                      <input
                        required
                        value={manualClientName}
                        onChange={(e) => setManualClientName(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">Telefone / WhatsApp</label>
                      <input
                        value={manualClientPhone}
                        onChange={(e) => setManualClientPhone(e.target.value)}
                        placeholder="(33) 99999-0000"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">Data *</label>
                        <input
                          required
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">Horário *</label>
                        <select
                          value={manualHour}
                          onChange={(e) => setManualHour(e.target.value)}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                        >
                          {standardHours.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">Serviço</label>
                        <select
                          value={manualServiceName}
                          onChange={(e) => setManualServiceName(e.target.value)}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                        >
                          <option value="Corte masculino">Corte masculino</option>
                          <option value="Corte + barba">Corte + barba</option>
                          <option value="Barba terapia">Barba terapia</option>
                          <option value="Escova e hidratação">Escova e hidratação</option>
                          <option value="Manicure e pedicure">Manicure e pedicure</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">Valor (R$)</label>
                        <input
                          value={manualServicePrice}
                          onChange={(e) => setManualServicePrice(e.target.value)}
                          placeholder="35.00"
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsManualAppointmentModalOpen(false)}
                        className="flex-1 rounded-xl border border-border py-2.5 text-xs font-bold text-muted-foreground hover:bg-accent/20 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 text-xs font-bold transition-colors shadow-md"
                      >
                        Salvar Agendamento
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 4: CARDÁPIO / CATÁLOGO / SERVIÇOS ================= */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                  <Package className="size-6 text-primary" />
                  {storeType === "agendamento"
                    ? `Serviços & Preços · ${currentUser.storeName}`
                    : `Cardápio & Catálogo · ${currentUser.storeName}`}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Gerencie produtos, pause itens esgotados e cadastre novidades
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 text-xs font-bold shadow-md transition-all hover:scale-102"
                >
                  <Plus className="size-4" />
                  <span>
                    {storeType === "agendamento" ? "Novo Serviço" : "Novo Item no Cardápio"}
                  </span>
                </button>
              </div>
            </div>

            {/* Filter Search */}
            <div className="flex items-center gap-2 rounded-2xl border border-input bg-card px-3.5 py-2 max-w-md">
              <Search className="size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchCatalog}
                onChange={(e) => setSearchCatalog(e.target.value)}
                placeholder="Filtrar por nome ou categoria..."
                className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storeItems
                .filter(
                  (i) =>
                    i.name.toLowerCase().includes(searchCatalog.toLowerCase()) ||
                    i.category.toLowerCase().includes(searchCatalog.toLowerCase()),
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-3xl border p-5 shadow-card flex flex-col justify-between transition-all ${
                      item.available
                        ? "border-border bg-card"
                        : "border-amber-300 bg-amber-50/40 opacity-80"
                    }`}
                  >
                    <div>
                      <div className="flex items-start gap-4">
                        <div className="grid size-16 shrink-0 place-items-center rounded-2xl accent-soft text-3xl">
                          {item.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {item.category}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                                item.available
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.available ? "Ativo" : "Pausado (Esgotado)"}
                            </span>
                          </div>
                          <h3 className="font-bold text-base text-foreground mt-0.5 truncate">{item.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                        <span className="text-base font-extrabold text-primary">{brl(item.price)}</span>
                        {!item.available && (
                          <span className="text-[11px] font-bold text-red-700 flex items-center gap-1">
                            <Ban className="size-3" /> Bloqueado no app
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleTogglePauseItem(item.id, item.name)}
                        className={`flex-1 rounded-xl py-2.5 px-3 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                          item.available
                            ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {item.available ? (
                          <>
                            <Ban className="size-3.5" />
                            <span>Pausar Item</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="size-3.5" />
                            <span>Reativar Item</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteMerchantItem(item.id);
                          toast.info(`"${item.name}" foi excluído do catálogo.`);
                        }}
                        className="grid size-9 place-items-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Excluir item"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* MODAL: ADICIONAR NOVO PRODUTO */}
            {isProductModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl max-w-md w-full space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-bold text-base text-foreground">
                      {storeType === "agendamento" ? "Novo Serviço" : "Novo Item / Prato"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">Nome do Item *</label>
                      <input
                        required
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Ex: X-Picanha Gourmet ou Barba Terapia"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">Preço (R$) *</label>
                        <input
                          required
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          placeholder="Ex: 35.00"
                          inputMode="decimal"
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1">Emoji / Ícone</label>
                        <input
                          value={newItemEmoji}
                          onChange={(e) => setNewItemEmoji(e.target.value)}
                          placeholder="🍔 ou ✂️"
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary text-center text-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">Categoria</label>
                      <input
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value)}
                        placeholder="Ex: Lanches, Sobremesas ou Estética"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">Descrição</label>
                      <textarea
                        rows={2}
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        placeholder="Detalhes e ingredientes do produto..."
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                      />
                    </div>

                    <div className="pt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsProductModalOpen(false)}
                        className="flex-1 rounded-xl border border-border py-2.5 text-xs font-bold text-muted-foreground hover:bg-accent/20 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 text-xs font-bold transition-colors shadow-md"
                      >
                        Salvar Item
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 5: CONFIGURAÇÕES ================= */}
        {activeTab === "settings" && (
          <div className="max-w-3xl space-y-6">
            <div className="pb-4 border-b border-border">
              <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                <Settings className="size-6 text-primary" /> Configurações de {currentUser.storeName}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dados operacionais específicos deste estabelecimento
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Configurações da empresa salvas com sucesso!");
              }}
              className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">Nome do Estabelecimento</label>
                  <input
                    defaultValue={currentUser.storeName}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">Categoria</label>
                  <input
                    defaultValue={currentUser.storeCategory}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">WhatsApp p/ Contato</label>
                  <input
                    defaultValue="(33) 99999-1234"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">Horário de Funcionamento</label>
                  <input
                    defaultValue="Segunda a Sábado das 08:00 às 19:00"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end">
                <button
                  type="submit"
                  className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-xs font-bold shadow-md transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
