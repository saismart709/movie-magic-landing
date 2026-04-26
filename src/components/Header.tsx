import { Link } from "@tanstack/react-router";
import { Search, MapPin, Menu, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
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
          <Button variant="ghost" size="sm" className="hidden md:inline-flex gap-1.5">
            <MapPin className="h-4 w-4" />
            Mumbai
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