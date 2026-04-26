import { Star, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  votes: string;
  genres: string[];
  language: string;
  format: string;
}

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <article className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl bg-muted shadow-[var(--shadow-card)] aspect-[2/3]">
        <img
          src={movie.poster}
          alt={`${movie.title} movie poster`}
          loading="lazy"
          width={512}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[var(--gradient-card)] opacity-90" />
        <button
          aria-label="Add to favourites"
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/60 text-foreground backdrop-blur-md transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Heart className="h-4 w-4" />
        </button>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-background/70 px-2 py-1 backdrop-blur-md">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs font-semibold">{movie.rating}</span>
          <span className="text-xs text-muted-foreground">({movie.votes})</span>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {movie.genres.join(" / ")}
        </p>
        <div className="flex flex-wrap gap-1 pt-1">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {movie.format}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {movie.language}
          </Badge>
        </div>
      </div>
    </article>
  );
}