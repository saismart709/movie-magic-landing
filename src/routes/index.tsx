import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MovieCard, type Movie } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles } from "lucide-react";
import { movies } from "@/data/movies";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BookMyShow — Movie Tickets, Plays & Live Events" },
      {
        name: "description",
        content:
          "Book movie tickets online for the latest blockbusters. Browse featured films, genres, ratings, and showtimes.",
      },
      { property: "og:title", content: "BookMyShow — Featured Movies" },
      {
        property: "og:description",
        content: "Discover and book the hottest movies playing near you.",
      },
    ],
  }),
  component: Index,
});

function MovieGrid({ items }: { items: Movie[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <Icon className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">{subtitle}</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold md:text-3xl">{title}</h2>
      </div>
      <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
        See all →
      </Button>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero movies={movies} />

        <section id="featured-movies" className="container mx-auto px-4 py-12 md:px-6 md:py-16 scroll-mt-20">
          <SectionHeader icon={Flame} title="Featured Movies" subtitle="Trending now" />
          <MovieGrid items={movies.slice(0, 5)} />
        </section>

        <section id="recommended-movies" className="container mx-auto px-4 pb-16 md:px-6 md:pb-24 scroll-mt-20">
          <SectionHeader icon={Sparkles} title="Recommended for You" subtitle="Just for you" />
          <MovieGrid items={movies.slice(5, 10)} />
        </section>

        <footer className="border-t border-border/50 bg-secondary/40 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground md:px-6">
            © {new Date().getFullYear()} BookMyShow Clone — Built for demo purposes.
          </div>
        </footer>
      </main>
    </div>
  );
}
