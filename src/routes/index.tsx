import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MovieCard, type Movie } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles } from "lucide-react";
import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";
import movie4 from "@/assets/movie-4.jpg";
import movie5 from "@/assets/movie-5.jpg";
import movie6 from "@/assets/movie-6.jpg";
import movie7 from "@/assets/movie-7.jpg";
import movie8 from "@/assets/movie-8.jpg";

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

const movies: Movie[] = [
  { id: 1, title: "Stellar Horizon", poster: movie1, rating: 9.2, votes: "84.5K", genres: ["Sci-Fi", "Adventure"], language: "English", format: "IMAX 3D" },
  { id: 2, title: "Letters from Paris", poster: movie2, rating: 8.4, votes: "32.1K", genres: ["Romance", "Drama"], language: "French", format: "2D" },
  { id: 3, title: "Neon Shadows", poster: movie3, rating: 8.9, votes: "67.3K", genres: ["Action", "Thriller"], language: "English", format: "4DX" },
  { id: 4, title: "The Hollow House", poster: movie4, rating: 7.8, votes: "21.8K", genres: ["Horror", "Mystery"], language: "English", format: "2D" },
  { id: 5, title: "Wonder Woods", poster: movie5, rating: 8.6, votes: "45.9K", genres: ["Animation", "Family"], language: "Hindi", format: "3D" },
  { id: 6, title: "Endless Summer", poster: movie6, rating: 7.5, votes: "18.2K", genres: ["Comedy", "Drama"], language: "English", format: "2D" },
  { id: 7, title: "Final Lap", poster: movie7, rating: 8.1, votes: "29.4K", genres: ["Sports", "Biography"], language: "Hindi", format: "IMAX" },
  { id: 8, title: "Midnight Detective", poster: movie8, rating: 8.7, votes: "38.7K", genres: ["Mystery", "Noir"], language: "English", format: "2D" },
];

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

        <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
          <SectionHeader icon={Flame} title="Featured Movies" subtitle="Trending now" />
          <MovieGrid items={movies.slice(0, 5)} />
        </section>

        <section className="container mx-auto px-4 pb-16 md:px-6 md:pb-24">
          <SectionHeader icon={Sparkles} title="Recommended for You" subtitle="Just for you" />
          <MovieGrid items={movies.slice(3, 8)} />
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
