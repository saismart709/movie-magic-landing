import { Button } from "@/components/ui/button";
import { Play, Calendar } from "lucide-react";
import type { Movie } from "./MovieCard";

export function Hero({ movies }: { movies: Movie[] }) {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-secondary">
      <div className="container mx-auto px-4 py-10 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Now showing this week
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Book your next{" "}
              <span className="bg-[var(--gradient-hero)] bg-clip-text text-transparent">
                cinematic escape
              </span>
            </h1>
            <p className="max-w-md text-base text-muted-foreground md:text-lg">
              Discover blockbusters, indie gems, and live events. The big screen
              is calling — grab the best seats before they're gone.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="gap-2 shadow-[var(--shadow-glow)]"
                onClick={() =>
                  document
                    .getElementById("featured-movies")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                <Play className="h-4 w-4 fill-current" />
                Browse Movies
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() =>
                  document
                    .getElementById("recommended-movies")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                <Calendar className="h-4 w-4" />
                Coming Soon
              </Button>
            </div>
          </div>

          <div className="relative h-[340px] md:h-[440px]">
            {movies.slice(0, 3).map((m, i) => (
              <div
                key={m.id}
                className="absolute top-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-[var(--shadow-card)] ring-1 ring-border/50 transition-transform duration-500 hover:-translate-y-[55%]"
                style={{
                  left: `${i * 28}%`,
                  width: "55%",
                  aspectRatio: "2 / 3",
                  zIndex: 10 - i,
                  transform: `translateY(-50%) rotate(${(i - 1) * 4}deg)`,
                }}
              >
                <img
                  src={m.poster}
                  alt={m.title}
                  width={512}
                  height={768}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
    </section>
  );
}