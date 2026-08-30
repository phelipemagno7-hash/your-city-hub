import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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
  type: "delivery" | "agendamento";
  title: string;
  subtitle: string;
  total: number;
  createdAt: string;
  status: string;
};

type StoreValue = {
  cart: CartLine[];
  addToCart: (line: Omit<CartLine, "qty">) => void;
  changeQty: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void;
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
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(read<CartLine[]>("ipa-cart", []));
    setOrders(read<Order[]>("ipa-orders", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("ipa-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("ipa-orders", JSON.stringify(orders));
  }, [orders, hydrated]);

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

  const addOrder = useCallback((order: Omit<Order, "id" | "createdAt">) => {
    setOrders((prev) => [
      { ...order, id: Math.random().toString(36).slice(2, 8).toUpperCase(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      cart,
      addToCart,
      changeQty,
      clearCart,
      cartCount: cart.reduce((s, l) => s + l.qty, 0),
      cartTotal: cart.reduce((s, l) => s + l.qty * l.price, 0),
      orders,
      addOrder,
    }),
    [cart, orders, addToCart, changeQty, clearCart, addOrder],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
