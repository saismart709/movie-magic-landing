import { Link } from "@tanstack/react-router";
import { Search, MapPin, Menu, Ticket, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Header() {
  const [city, setCity] = useState<string>("Detect");
  const [loading, setLoading] = useState(false);

  const detect = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation not supported by this browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=10`,
            { headers: { Accept: "application/json" } }
          );
          const data = await res.json();
          const a = data.address ?? {};
          const name =
            a.city || a.town || a.village || a.county || a.state || "Your area";
          setCity(name);
          toast.success(`Location set to ${name}`);
        } catch {
          setCity("Your area");
          toast.success("Location detected");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        toast.error(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied."
            : "Couldn't detect location."
        );
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );
  };

  useEffect(() => {
    // Auto-attempt once on mount; silently ignore if denied.
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;
    if (sessionStorage.getItem("geo-asked")) return;
    sessionStorage.setItem("geo-asked", "1");
    detect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center gap-3 px-4 md:gap-6 md:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Ticket className="h-5 w-5" />
          </div>
          <span className="hidden text-xl font-bold tracking-tight sm:inline">
            book<span className="text-primary">my</span>show
          </span>
        </Link>

        <div className="relative hidden flex-1 max-w-xl md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for movies, events, plays, sports..."
            className="pl-9 bg-muted border-transparent focus-visible:border-primary"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={detect}
            disabled={loading}
            className="hidden md:inline-flex gap-1.5"
            title="Detect my location"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            {city}
          </Button>
          <Button size="sm" className="hidden sm:inline-flex">Sign in</Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}