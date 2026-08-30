import { Link } from "@tanstack/react-router";
import { Home, ClipboardList, Search, User } from "lucide-react";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/busca", label: "Busca", icon: Search },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card shadow-float">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors"
            activeProps={{ className: "!text-primary" }}
          >
            <Icon className="size-5" strokeWidth={2} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
