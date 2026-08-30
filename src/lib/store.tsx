import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { restaurants, products, places, professionals } from "./data";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  emoji: string;
  qty: number;
  restaurantId: string;
  restaurantName: string;
};

export type Order = {
  id: string;
  storeId: string;
  type: "delivery" | "agendamento";
  title: string;
  subtitle: string;
  total: number;
  createdAt: string;
  status: string;
  customerName?: string | undefined;
  customerPhone?: string | undefined;
  dateStr?: string | undefined;
  hour?: string | undefined;
  serviceId?: string | undefined;
  isManual?: boolean | undefined;
};

export type MerchantItem = {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  category: string;
  available: boolean;
};

export type BlockedSlot = {
  storeId: string;
  dateStr: string; // formato "YYYY-MM-DD" ou "DD/MM/YYYY"
  hour: string; // formato "14:00"
  reason?: string | undefined;
};

export type UserRole = "customer" | "merchant";
export type StoreType = "delivery" | "vitrine" | "agendamento" | "profissional";

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string | undefined;
  storeName?: string | undefined;
  storeType?: StoreType | undefined;
  storeCategory?: string | undefined;
  emoji?: string | undefined;
};

export const demoAccounts: UserAccount[] = [
  {
    id: "cliente-phelipe",
    name: "Phelipe Magno",
    email: "phelipe@email.com",
    role: "customer",
    emoji: "👤",
  },
  {
    id: "dono-burger",
    name: "Carlos Silva (Dono)",
    email: "contato@burgerdapraca.com",
    role: "merchant",
    storeId: "burger-da-praca",
    storeName: "Burger da Praça",
    storeType: "delivery",
    storeCategory: "Lanches & Hambúrgueres",
    emoji: "🍔",
  },
  {
    id: "dono-pizzaria",
    name: "Giuseppe Bella (Dono)",
    email: "bella@pizzaria.com",
    role: "merchant",
    storeId: "pizzaria-bella",
    storeName: "Pizzaria Bella Ipa",
    storeType: "delivery",
    storeCategory: "Pizzas Artesanais",
    emoji: "🍕",
  },
  {
    id: "dono-cantinho",
    name: "Dona Maria (Proprietária)",
    email: "marmitas@cantinhomineiro.com",
    role: "merchant",
    storeId: "cantinho-mineiro",
    storeName: "Cantinho Mineiro",
    storeType: "delivery",
    storeCategory: "Marmitarias & Comida Caseira",
    emoji: "🍛",
  },
  {
    id: "dono-barbearia-ze",
    name: "José Ferreira (Barbeiro Zé)",
    email: "ze@barbeariadoze.com",
    role: "merchant",
    storeId: "barbearia-do-ze",
    storeName: "Barbearia do Zé",
    storeType: "agendamento",
    storeCategory: "Barbearia & Estética Masculina",
    emoji: "💈",
  },
  {
    id: "dono-salao-bella",
    name: "Isabella Hair (Proprietária)",
    email: "isabella@bellahair.com",
    role: "merchant",
    storeId: "salao-bella-hair",
    storeName: "Salão Bella Hair",
    storeType: "agendamento",
    storeCategory: "Salão de Beleza & Cabelos",
    emoji: "💇",
  },
  {
    id: "dono-clinica-sorriso",
    name: "Dra. Patrícia Odonto",
    email: "contato@clinicasorriso.com",
    role: "merchant",
    storeId: "clinica-sorriso",
    storeName: "Clínica Sorriso",
    storeType: "agendamento",
    storeCategory: "Odontologia & Saúde",
    emoji: "🦷",
  },
  {
    id: "dono-boutique-ipe",
    name: "Dona Flor (Lojista)",
    email: "moda@boutiqueflordeipe.com",
    role: "merchant",
    storeId: "boutique-ipe",
    storeName: "Boutique Flor de Ipê",
    storeType: "vitrine",
    storeCategory: "Moda & Vestuário Feminino",
    emoji: "👗",
  },
  {
    id: "dono-carlos-eletricista",
    name: "Carlos Andrade (Eletricista)",
    email: "carlos.eletricista@email.com",
    role: "merchant",
    storeId: "carlos-eletricista",
    storeName: "Carlos Andrade — Eletricista",
    storeType: "profissional",
    storeCategory: "Instalações Elétricas Residenciais",
    emoji: "⚡",
  },
];

type StoreValue = {
  // Auth & Session
  currentUser: UserAccount;
  loginAs: (account: UserAccount) => void;
  logout: () => void;

  // Cart
  cart: CartLine[];
  addToCart: (line: Omit<CartLine, "qty">) => void;
  changeQty: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Orders (Isolated)
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
  getStoreOrders: (storeId: string) => Order[];
  getStoreAppointments: (storeId: string) => Order[];

  // Appointments Management & Schedule Blocking
  blockedSlots: BlockedSlot[];
  blockSlot: (storeId: string, dateStr: string, hour: string, reason?: string | undefined) => void;
  unblockSlot: (storeId: string, dateStr: string, hour: string) => void;
  isSlotBlocked: (storeId: string, dateStr: string, hour: string) => boolean;
  addManualAppointment: (data: {
    storeId: string;
    clientName: string;
    clientPhone?: string | undefined;
    serviceName: string;
    servicePrice: number;
    dateStr: string;
    hour: string;
  }) => void;
  cancelAppointment: (orderId: string) => void;

  // Products & Menu Pausing
  pausedItemIds: string[];
  isItemPaused: (id: string) => boolean;
  togglePauseItem: (id: string) => boolean;
  customMerchantItems: MerchantItem[];
  addMerchantItem: (item: Omit<MerchantItem, "id" | "available">) => void;
  deleteMerchantItem: (id: string) => void;
  getStoreItems: (storeId: string) => MerchantItem[];

  // Store Open / Closed status per store
  isStoreOpen: (storeId?: string) => boolean;
  toggleStoreStatus: (storeId?: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount>(demoAccounts[1]!); // Default: Dono do Burger da Praça
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [pausedItemIds, setPausedItemIds] = useState<string[]>([]);
  const [customMerchantItems, setCustomMerchantItems] = useState<MerchantItem[]>([]);
  const [storeStatusMap, setStoreStatusMap] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 1. Current user
    const savedUser = read<UserAccount | null>("ipa-current-user", null);
    if (savedUser) {
      setCurrentUser(savedUser);
    }

    // 2. Cart
    setCart(read<CartLine[]>("ipa-cart", []));

    // 3. Orders with strict storeId seeds
    const savedOrders = read<Order[]>("ipa-orders", []);
    if (savedOrders.length === 0) {
      const todayStr = new Date().toLocaleDateString("pt-BR");
      const demoOrders: Order[] = [
        // Pedidos do Burger da Praça
        {
          id: "PED-842",
          storeId: "burger-da-praca",
          type: "delivery",
          title: "Burger da Praça",
          subtitle: "2 itens · X-Bacon Duplo + Refrigerante · PIX",
          total: 40.5,
          createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          status: "Em preparo",
          customerName: "Lucas Mendes",
          customerPhone: "(33) 99888-1122",
        },
        {
          id: "PED-841",
          storeId: "burger-da-praca",
          type: "delivery",
          title: "Burger da Praça",
          subtitle: "1 item · X-Salada da Casa · Cartão",
          total: 32.9,
          createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
          status: "Saiu para entrega",
          customerName: "Fernanda Rocha",
          customerPhone: "(33) 99777-3344",
        },
        {
          id: "PED-839",
          storeId: "burger-da-praca",
          type: "delivery",
          title: "Burger da Praça",
          subtitle: "3 itens · Batata Grande + 2 Sucos · Dinheiro (troco p/ 50)",
          total: 47.0,
          createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          status: "Concluído",
          customerName: "Mateus Ribeiro",
        },
        // Pedidos da Pizzaria Bella
        {
          id: "PED-910",
          storeId: "pizzaria-bella",
          type: "delivery",
          title: "Pizzaria Bella Ipa",
          subtitle: "1 Pizza Frango c/ Catupiry + Guaraná 2L · PIX",
          total: 64.0,
          createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
          status: "Em preparo",
          customerName: "Camila Santos",
        },
        // Agendamentos da Barbearia do Zé
        {
          id: "AGE-101",
          storeId: "barbearia-do-ze",
          type: "agendamento",
          title: "Barbearia do Zé · Corte + barba",
          subtitle: `${todayStr} às 10:00 · Cliente: Marcos Vinícius`,
          total: 55.0,
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          status: "Confirmado",
          customerName: "Marcos Vinícius",
          customerPhone: "(33) 99111-2233",
          dateStr: todayStr,
          hour: "10:00",
          serviceId: "c2",
        },
        {
          id: "AGE-102",
          storeId: "barbearia-do-ze",
          type: "agendamento",
          title: "Barbearia do Zé · Corte masculino",
          subtitle: `${todayStr} às 15:00 · Cliente: Gabriel Souza (Marcado no balcão)`,
          total: 35.0,
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          status: "Confirmado",
          customerName: "Gabriel Souza",
          customerPhone: "(33) 99222-4455",
          dateStr: todayStr,
          hour: "15:00",
          serviceId: "c1",
          isManual: true,
        },
        // Agendamentos do Salão Bella Hair
        {
          id: "AGE-201",
          storeId: "salao-bella-hair",
          type: "agendamento",
          title: "Salão Bella Hair · Manicure e pedicure",
          subtitle: `${todayStr} às 14:30 · Cliente: Juliana Costa`,
          total: 55.0,
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          status: "Confirmado",
          customerName: "Juliana Costa",
          customerPhone: "(33) 99333-6677",
          dateStr: todayStr,
          hour: "14:30",
          serviceId: "h3",
        },
      ];
      setOrders(demoOrders);
    } else {
      setOrders(savedOrders);
    }

    setBlockedSlots(read<BlockedSlot[]>("ipa-blocked-slots", []));
    setPausedItemIds(read<string[]>("ipa-paused-items", []));
    setCustomMerchantItems(read<MerchantItem[]>("ipa-custom-merchant-items", []));
    setStoreStatusMap(read<Record<string, boolean>>("ipa-store-status-map", {}));
    setHydrated(true);
  }, []);

  // Sync with LocalStorage
  useEffect(() => {
    if (hydrated) window.localStorage.setItem("ipa-current-user", JSON.stringify(currentUser));
  }, [currentUser, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("ipa-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("ipa-orders", JSON.stringify(orders));
  }, [orders, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("ipa-blocked-slots", JSON.stringify(blockedSlots));
  }, [blockedSlots, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("ipa-paused-items", JSON.stringify(pausedItemIds));
  }, [pausedItemIds, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("ipa-custom-merchant-items", JSON.stringify(customMerchantItems));
  }, [customMerchantItems, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("ipa-store-status-map", JSON.stringify(storeStatusMap));
  }, [storeStatusMap, hydrated]);

  // Auth Methods
  const loginAs = useCallback((account: UserAccount) => {
    setCurrentUser(account);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(demoAccounts[0]!); // Switch back to customer
  }, []);

  // Cart Methods
  const addToCart = useCallback((line: Omit<CartLine, "qty">) => {
    setCart((prev) => {
      const base = prev[0] && prev[0].restaurantId !== line.restaurantId ? [] : prev;
      const found = base.find((l) => l.id === line.id);
      if (found) return base.map((l) => (l.id === line.id ? { ...l, qty: l.qty + 1 } : l));
      return [...base, { ...line, qty: 1 }];
    });
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // Orders Management
  const addOrder = useCallback((order: Omit<Order, "id" | "createdAt">) => {
    setOrders((prev) => [
      {
        ...order,
        id: `PED-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  }, []);

  const getStoreOrders = useCallback(
    (storeId: string) => {
      return orders.filter((o) => o.storeId === storeId && o.type === "delivery");
    },
    [orders],
  );

  const getStoreAppointments = useCallback(
    (storeId: string) => {
      const targetId = storeId.replace("barbearia-ze", "barbearia-do-ze");
      return orders.filter(
        (o) => (o.storeId === targetId || o.storeId === storeId) && o.type === "agendamento" && o.status !== "Cancelado",
      );
    },
    [orders],
  );

  // Slot Blocking / Pausing for Barber & Salons
  const blockSlot = useCallback((storeId: string, dateStr: string, hour: string, reason?: string | undefined) => {
    const targetId = storeId.replace("barbearia-ze", "barbearia-do-ze");
    setBlockedSlots((prev) => {
      if (prev.some((s) => s.storeId === targetId && s.dateStr === dateStr && s.hour === hour)) {
        return prev;
      }
      return [...prev, { storeId: targetId, dateStr, hour, reason }];
    });
  }, []);

  const unblockSlot = useCallback((storeId: string, dateStr: string, hour: string) => {
    const targetId = storeId.replace("barbearia-ze", "barbearia-do-ze");
    setBlockedSlots((prev) =>
      prev.filter((s) => !(s.storeId === targetId && s.dateStr === dateStr && s.hour === hour)),
    );
  }, []);

  const isSlotBlocked = useCallback(
    (storeId: string, dateStr: string, hour: string) => {
      const targetId = storeId.replace("barbearia-ze", "barbearia-do-ze");
      return blockedSlots.some(
        (s) => (s.storeId === targetId || s.storeId === storeId) && s.dateStr === dateStr && s.hour === hour,
      );
    },
    [blockedSlots],
  );

  // Manual Appointments
  const addManualAppointment = useCallback(
    (data: {
      storeId: string;
      clientName: string;
      clientPhone?: string | undefined;
      serviceName: string;
      servicePrice: number;
      dateStr: string;
      hour: string;
    }) => {
      const targetId = data.storeId.replace("barbearia-ze", "barbearia-do-ze");
      const place = places.find((p) => p.id === targetId || p.id === data.storeId);
      const storeTitle = place ? place.name : "Barbearia / Salão";

      const newAppointment: Order = {
        id: `AGE-${Math.floor(100 + Math.random() * 900)}`,
        storeId: targetId,
        type: "agendamento",
        title: `${storeTitle} · ${data.serviceName}`,
        subtitle: `${data.dateStr} às ${data.hour} · Cliente: ${data.clientName} (Manual)`,
        total: data.servicePrice,
        createdAt: new Date().toISOString(),
        status: "Confirmado",
        customerName: data.clientName,
        customerPhone: data.clientPhone,
        dateStr: data.dateStr,
        hour: data.hour,
        isManual: true,
      };

      setOrders((prev) => [newAppointment, ...prev]);
    },
    [],
  );

  const cancelAppointment = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelado" } : o)),
    );
  }, []);

  // Menu / Product Pausing
  const isItemPaused = useCallback(
    (id: string) => pausedItemIds.includes(id),
    [pausedItemIds],
  );

  const togglePauseItem = useCallback((id: string): boolean => {
    let nowPaused = false;
    setPausedItemIds((prev) => {
      if (prev.includes(id)) {
        nowPaused = false;
        return prev.filter((itemId) => itemId !== id);
      } else {
        nowPaused = true;
        return [...prev, id];
      }
    });
    return nowPaused;
  }, []);

  const addMerchantItem = useCallback((item: Omit<MerchantItem, "id" | "available">) => {
    const newItem: MerchantItem = {
      ...item,
      id: `custom-${Date.now()}`,
      available: true,
    };
    setCustomMerchantItems((prev) => [newItem, ...prev]);
  }, []);

  const deleteMerchantItem = useCallback((id: string) => {
    setCustomMerchantItems((prev) => prev.filter((item) => item.id !== id));
    setPausedItemIds((prev) => prev.filter((itemId) => itemId !== id));
  }, []);

  // Store Open / Closed
  const isStoreOpen = useCallback(
    (storeId?: string) => {
      const id = storeId || currentUser.storeId || "default";
      return storeStatusMap[id] !== false; // Default: true (aberta)
    },
    [currentUser.storeId, storeStatusMap],
  );

  const toggleStoreStatus = useCallback(
    (storeId?: string) => {
      const id = storeId || currentUser.storeId || "default";
      setStoreStatusMap((prev) => ({
        ...prev,
        [id]: prev[id] === false ? true : false,
      }));
    },
    [currentUser.storeId],
  );

  // Dynamic Store Items
  const getStoreItems = useCallback(
    (storeId: string): MerchantItem[] => {
      const baseItems: MerchantItem[] = [];

      // 1. Restaurants
      const restaurant = restaurants.find((r) => r.id === storeId);
      if (restaurant) {
        restaurant.menu.forEach((section) => {
          section.items.forEach((item) => {
            baseItems.push({
              id: item.id,
              storeId: restaurant.id,
              name: item.name,
              description: item.description,
              price: item.price,
              emoji: item.emoji,
              category: section.section,
              available: !pausedItemIds.includes(item.id),
            });
          });
        });
      }

      // 2. Vitrine Store
      if (storeId === "boutique-ipe" || storeId === "vitrine") {
        products.forEach((p) => {
          if (p.store.toLowerCase().includes("flor de ipê") || storeId === "boutique-ipe" || storeId === "vitrine") {
            baseItems.push({
              id: p.id,
              storeId: "boutique-ipe",
              name: p.name,
              description: p.description,
              price: p.price,
              emoji: p.emoji,
              category: p.category,
              available: !pausedItemIds.includes(p.id),
            });
          }
        });
      }

      // 3. Appointment Places (Barbearia, Salão, Clínica)
      const placeTargetId = storeId.replace("barbearia-ze", "barbearia-do-ze");
      const place = places.find((pl) => pl.id === placeTargetId || pl.id === storeId);
      if (place) {
        place.services.forEach((s) => {
          baseItems.push({
            id: s.id,
            storeId: place.id,
            name: s.name,
            description: `Duração estimada: ${s.duration}`,
            price: s.price,
            emoji: place.emoji,
            category: "Serviços",
            available: !pausedItemIds.includes(s.id),
          });
        });
      }

      // 4. Professionals
      if (storeId === "carlos-eletricista" || storeId === "s2") {
        baseItems.push({
          id: "serv-eletrica-1",
          storeId: "carlos-eletricista",
          name: "Instalação Residencial Completa",
          description: "Quadro de distribuição, tomadas e fiação.",
          price: 150.0,
          emoji: "⚡",
          category: "Elétrica",
          available: !pausedItemIds.includes("serv-eletrica-1"),
        });
        baseItems.push({
          id: "serv-eletrica-2",
          storeId: "carlos-eletricista",
          name: "Atendimento Emergencial 24h",
          description: "Curto-circuito e pane elétrica.",
          price: 80.0,
          emoji: "🚨",
          category: "Emergência",
          available: !pausedItemIds.includes("serv-eletrica-2"),
        });
      }

      // Custom items created for this store
      const customForStore = customMerchantItems
        .filter((item) => item.storeId === storeId || item.storeId === placeTargetId)
        .map((item) => ({
          ...item,
          available: !pausedItemIds.includes(item.id),
        }));

      return [...baseItems, ...customForStore];
    },
    [pausedItemIds, customMerchantItems],
  );

  const value = useMemo<StoreValue>(
    () => ({
      currentUser,
      loginAs,
      logout,
      cart,
      addToCart,
      changeQty,
      clearCart,
      cartCount: cart.reduce((s, l) => s + l.qty, 0),
      cartTotal: cart.reduce((s, l) => s + l.qty * l.price, 0),
      orders,
      addOrder,
      updateOrderStatus,
      getStoreOrders,
      getStoreAppointments,
      blockedSlots,
      blockSlot,
      unblockSlot,
      isSlotBlocked,
      addManualAppointment,
      cancelAppointment,
      pausedItemIds,
      isItemPaused,
      togglePauseItem,
      customMerchantItems,
      addMerchantItem,
      deleteMerchantItem,
      getStoreItems,
      isStoreOpen,
      toggleStoreStatus,
    }),
    [
      currentUser,
      loginAs,
      logout,
      cart,
      orders,
      addToCart,
      changeQty,
      clearCart,
      addOrder,
      updateOrderStatus,
      getStoreOrders,
      getStoreAppointments,
      blockedSlots,
      blockSlot,
      unblockSlot,
      isSlotBlocked,
      addManualAppointment,
      cancelAppointment,
      pausedItemIds,
      isItemPaused,
      togglePauseItem,
      customMerchantItems,
      addMerchantItem,
      deleteMerchantItem,
      getStoreItems,
      isStoreOpen,
      toggleStoreStatus,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
