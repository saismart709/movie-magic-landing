import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin, Ticket } from "lucide-react";
import { getMovieById, getTheatersForMovie, type Theater } from "@/data/movies";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface SeatsSearch {
  tickets: number;
  theater: string;
  time: string;
  format: string;
  price: number;
}

export const Route = createFileRoute("/movies/$movieId/seats")({
  validateSearch: (search: Record<string, unknown>): SeatsSearch => ({
    tickets: Math.min(10, Math.max(1, Number(search.tickets) || 1)),
    theater: String(search.theater ?? ""),
    time: String(search.time ?? ""),
    format: String(search.format ?? "2D"),
    price: Number(search.price) || 0,
  }),
  loader: ({ params }) => {
    const movie = getMovieById(Number(params.movieId));
    if (!movie) throw notFound();
    const theaters = getTheatersForMovie(movie.id);
    return { movie, theaters };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `Select Seats — ${loaderData.movie.title} | BookMyShow` }]
      : [{ title: "Select Seats" }],
  }),
  component: SeatsPage,
});

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS = 12;

/** Deterministic "occupied" seats so the layout is stable per showtime. */
function buildOccupied(seedStr: string): Set<string> {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
  const occupied = new Set<string>();
  const total = ROWS.length * COLS;
  const target = Math.floor(total * 0.35);
  while (occupied.size < target) {
    const r = ROWS[Math.floor(rng() * ROWS.length)];
    const c = Math.floor(rng() * COLS) + 1;
    occupied.add(`${r}${c}`);
  }
  return occupied;
}

function SeatsPage() {
  const { movie, theaters } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const theater =
    theaters.find((t: Theater) => t.id === search.theater) ?? theaters[0];

  const occupied = useMemo(
    () => buildOccupied(`${movie.id}-${theater.id}-${search.time}`),
    [movie.id, theater.id, search.time]
  );

  const [selected, setSelected] = useState<string[]>([]);
  const max = search.tickets;

  const toggle = (seat: string) => {
    if (occupied.has(seat)) return;
    setSelected((prev) => {
      if (prev.includes(seat)) return prev.filter((s) => s !== seat);
      if (prev.length >= max) {
        toast.warning(`You can only select ${max} seat${max > 1 ? "s" : ""}.`, {
          description: "Deselect a seat or change ticket count to pick more.",
        });
        return prev;
      }
      return [...prev, seat];
    });
  };

  const total = selected.length * search.price;
  const ready = selected.length === max;

  const confirm = () => {
    if (!ready) return;
    toast.success("Seats reserved!", {
      description: `${selected.sort().join(", ")} at ${theater.name} · ${search.time}`,
    });
    setTimeout(() => navigate({ to: "/" }), 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Toaster />
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted-foreground">
          <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to showtimes
          </Link>
        </Button>

        <header className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{movie.title}</h1>
            <p className="mt-1 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {theater.name} · {theater.area}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {search.time}
              </span>
              <Badge variant="outline" className="text-[10px]">{search.format}</Badge>
            </p>
          </div>
          <Badge variant="secondary" className="w-fit text-sm">
            Selecting {selected.length} / {max} seats
          </Badge>
        </header>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md border-2 border-[hsl(142_71%_45%)] text-[10px] font-semibold text-[hsl(142_71%_45%)]">A1</span>
            Available
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-[hsl(142_71%_45%)] text-[10px] font-semibold text-background">A1</span>
            Selected
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-muted text-[10px] font-semibold text-muted-foreground/70">A1</span>
            Sold
          </span>
        </div>

        {/* Screen */}
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="mx-auto h-2 w-3/4 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent shadow-[var(--shadow-glow)]" />
          <p className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            All eyes this way
          </p>

          {/* Seat grid */}
          <div className="mt-8 overflow-x-auto">
            <div className="mx-auto inline-block">
              {ROWS.map((row) => (
                <div key={row} className="flex items-center gap-2 py-1">
                  <span className="w-5 text-center text-xs font-semibold text-muted-foreground">
                    {row}
                  </span>
                  <div className="flex gap-1.5 sm:gap-2">
                    {Array.from({ length: COLS }, (_, i) => {
                      const num = i + 1;
                      const seat = `${row}${num}`;
                      const isOccupied = occupied.has(seat);
                      const isSelected = selected.includes(seat);
                      const gap = num === 6 ? "mr-3 sm:mr-4" : "";
                      const base =
                        "grid h-8 w-8 place-items-center rounded-md text-[10px] font-semibold transition-all sm:h-9 sm:w-9 sm:text-xs";
                      const cls = isOccupied
                        ? "bg-muted text-muted-foreground/60 cursor-not-allowed"
                        : isSelected
                          ? "bg-[hsl(142_71%_45%)] text-background scale-95 shadow-[0_0_0_2px_hsl(142_71%_45%)]"
                          : "border-2 border-[hsl(142_71%_45%)] text-[hsl(142_71%_45%)] hover:bg-[hsl(142_71%_45%)]/10";
                      return (
                        <button
                          key={seat}
                          type="button"
                          aria-label={`Seat ${seat} ${isOccupied ? "(sold)" : isSelected ? "(selected)" : "(available)"}`}
                          aria-pressed={isSelected}
                          disabled={isOccupied}
                          onClick={() => toggle(seat)}
                          className={`${base} ${cls} ${gap}`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary bar */}
        <div className="sticky bottom-4 mt-10">
          <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-border/60 bg-card/95 p-4 shadow-[var(--shadow-card)] backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="text-sm">
              <p className="font-semibold">
                {selected.length > 0 ? selected.sort().join(", ") : "No seats selected"}
              </p>
              <p className="text-muted-foreground">
                {selected.length} × ₹{search.price} ={" "}
                <span className="font-semibold text-foreground">₹{total}</span>
              </p>
            </div>
            <Button onClick={confirm} disabled={!ready} className="md:min-w-[200px]">
              <Ticket className="mr-2 h-4 w-4" />
              {ready ? `Confirm ${max} seat${max > 1 ? "s" : ""}` : `Select ${max - selected.length} more`}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}