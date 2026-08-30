import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  back = "/",
  right,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 bg-secondary px-4 pb-4 pt-5 text-secondary-foreground">
      <div className="mx-auto grid max-w-md grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <Link
          to={back}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary-foreground/10"
          aria-label="Voltar"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold">{title}</h1>
          {subtitle ? (
            <p className="truncate text-xs text-secondary-foreground/70">{subtitle}</p>
          ) : null}
        </div>
        <div className="shrink-0">{right}</div>
      </div>
    </header>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold">
      <span className="text-star">★</span>
      {rating.toFixed(1)}
    </span>
  );
}
