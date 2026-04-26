import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Ticket, ArrowLeft } from "lucide-react";
import { getMovieById, getTheatersForMovie } from "@/data/movies";

export const Route = createFileRoute("/movies/$movieId")({
  loader: ({ params }) => {
    const movie = getMovieById(Number(params.movieId));
    if (!movie) throw notFound();
    const theaters = getTheatersForMovie(movie.id);
    return { movie, theaters };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Book Tickets — ${loaderData.movie.title} | BookMyShow` },
          {
            name: "description",
            content: `Find theaters and showtimes for ${loaderData.movie.title}. Book your tickets online.`,
          },
          { property: "og:title", content: `${loaderData.movie.title} — Showtimes` },
          {
            property: "og:description",
            content: `See where ${loaderData.movie.title} is playing and pick a showtime that suits you.`,
          },
          { property: "og:image", content: loaderData.movie.poster },
        ]
      : [{ title: "Movie not found" }],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-24 text-center md:px-6">
        <h1 className="text-4xl font-bold">Movie not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't find the movie you're looking for.</p>
        <Button asChild className="mt-6">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  ),
  component: MovieDetailsPage,
});

function MovieDetailsPage() {
  const { movie, theaters } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Movie hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-2xl"
            style={{ backgroundImage: `url(${movie.poster})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-[var(--gradient-hero)]" aria-hidden />
          <div className="container relative mx-auto grid gap-8 px-4 py-12 md:grid-cols-[220px_1fr] md:px-6 md:py-16">
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              className="w-full max-w-[220px] rounded-xl shadow-[var(--shadow-glow)]"
              width={440}
              height={660}
            />
            <div className="flex flex-col justify-center gap-4">
              <Button asChild variant="ghost" size="sm" className="w-fit -ml-3 text-muted-foreground">
                <Link to="/">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Link>
              </Button>
              <h1 className="text-3xl font-bold md:text-5xl">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 rounded-md bg-background/70 px-2 py-1 backdrop-blur-md">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-semibold">{movie.rating}/10</span>
                  <span className="text-muted-foreground">({movie.votes} votes)</span>
                </span>
                <Badge variant="secondary">{movie.format}</Badge>
                <Badge variant="outline">{movie.language}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <Badge key={g} variant="outline">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Theaters & Showtimes */}
        <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
          <h2 className="text-2xl font-bold md:text-3xl">
            Theaters Showing <span className="text-primary">{movie.title}</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick a theater and showtime to continue with your booking.
          </p>

          <div className="mt-8 space-y-5">
            {theaters.map((theater) => (
              <article
                key={theater.id}
                className="rounded-xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)] md:p-6"
              >
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold md:text-xl">{theater.name}</h3>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {theater.area} · {theater.distanceKm.toFixed(1)} km away
                    </p>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    Cancellation available
                  </Badge>
                </div>

                <ul
                  className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
                  aria-label={`Showtimes at ${theater.name}`}
                >
                  {theater.showtimes.map((s) => {
                    const low = s.seatsLeft < 20;
                    return (
                      <li key={`${theater.id}-${s.time}`}>
                        <button
                          type="button"
                          className="group w-full rounded-lg border border-border/70 bg-background/40 p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 font-semibold">
                              <Clock className="h-3.5 w-3.5 text-primary" />
                              {s.time}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {s.format}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">₹{s.price}</span>
                            <span className={low ? "text-primary font-medium" : "text-muted-foreground"}>
                              {low ? `Filling fast · ${s.seatsLeft} left` : `${s.seatsLeft} seats`}
                            </span>
                          </div>
                          <span className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-md bg-primary/10 px-2 py-1.5 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            <Ticket className="h-3 w-3" /> Select
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}