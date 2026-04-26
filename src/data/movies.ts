import type { Movie } from "@/components/MovieCard";
import movie1 from "@/assets/movie-1.jpg";
import movie2 from "@/assets/movie-2.jpg";
import movie3 from "@/assets/movie-3.jpg";
import movie4 from "@/assets/movie-4.jpg";
import movie5 from "@/assets/movie-5.jpg";
import movie6 from "@/assets/movie-6.jpg";
import movie7 from "@/assets/movie-7.jpg";
import movie8 from "@/assets/movie-8.jpg";

export const movies: Movie[] = [
  { id: 1, title: "Stellar Horizon", poster: movie1, rating: 9.2, votes: "84.5K", genres: ["Sci-Fi", "Adventure"], language: "English", format: "IMAX 3D" },
  { id: 2, title: "Letters from Paris", poster: movie2, rating: 8.4, votes: "32.1K", genres: ["Romance", "Drama"], language: "French", format: "2D" },
  { id: 3, title: "Neon Shadows", poster: movie3, rating: 8.9, votes: "67.3K", genres: ["Action", "Thriller"], language: "English", format: "4DX" },
  { id: 4, title: "The Hollow House", poster: movie4, rating: 7.8, votes: "21.8K", genres: ["Horror", "Mystery"], language: "English", format: "2D" },
  { id: 5, title: "Wonder Woods", poster: movie5, rating: 8.6, votes: "45.9K", genres: ["Animation", "Family"], language: "Hindi", format: "3D" },
  { id: 6, title: "Endless Summer", poster: movie6, rating: 7.5, votes: "18.2K", genres: ["Comedy", "Drama"], language: "English", format: "2D" },
  { id: 7, title: "Final Lap", poster: movie7, rating: 8.1, votes: "29.4K", genres: ["Sports", "Biography"], language: "Hindi", format: "IMAX" },
  { id: 8, title: "Midnight Detective", poster: movie8, rating: 8.7, votes: "38.7K", genres: ["Mystery", "Noir"], language: "English", format: "2D" },
];

export interface Showtime {
  time: string;
  format: string;
  price: number;
  seatsLeft: number;
}

export interface Theater {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  showtimes: Showtime[];
}

const theaterTemplates: Omit<Theater, "showtimes">[] = [
  { id: "pvr-icon", name: "PVR ICON", area: "Phoenix Marketcity", distanceKm: 2.4 },
  { id: "inox-cp", name: "INOX Cineplex", area: "Connaught Place", distanceKm: 4.1 },
  { id: "cinepolis", name: "Cinépolis", area: "DLF Mall of India", distanceKm: 6.8 },
  { id: "imax-wave", name: "IMAX Wave", area: "Select Citywalk", distanceKm: 8.2 },
  { id: "miraj", name: "Miraj Cinemas", area: "Pacific Mall", distanceKm: 10.5 },
];

const baseSlots = ["10:15 AM", "01:30 PM", "04:45 PM", "07:30 PM", "10:45 PM"];

export function getTheatersForMovie(movieId: number): Theater[] {
  return theaterTemplates.map((t, idx) => {
    const offset = (movieId + idx) % baseSlots.length;
    const slots = [...baseSlots.slice(offset), ...baseSlots.slice(0, offset)].slice(0, 4);
    return {
      ...t,
      showtimes: slots.map((time, i) => ({
        time,
        format: i % 2 === 0 ? "2D" : i === 1 ? "IMAX" : "3D",
        price: 220 + ((movieId * 13 + idx * 7 + i * 19) % 180),
        seatsLeft: 8 + ((movieId * 5 + idx * 11 + i * 17) % 90),
      })),
    };
  });
}

export function getMovieById(id: number): Movie | undefined {
  return movies.find((m) => m.id === id);
}