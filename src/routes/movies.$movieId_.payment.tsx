import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Smartphone, Wallet, CheckCircle2, Loader2, MapPin, Clock, Ticket } from "lucide-react";
import { getMovieById, getTheatersForMovie } from "@/data/movies";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface PaymentSearch {
  seats: string;
  theater: string;
  time: string;
  format: string;
  price: number;
}

export const Route = createFileRoute("/movies/$movieId_/payment")({
  validateSearch: (s: Record<string, unknown>): PaymentSearch => ({
    seats: String(s.seats ?? ""),
    theater: String(s.theater ?? ""),
    time: String(s.time ?? ""),
    format: String(s.format ?? "2D"),
    price: Number(s.price) || 0,
  }),
  loader: ({ params }) => {
    const movie = getMovieById(Number(params.movieId));
    if (!movie) throw notFound();
    return { movie, theaters: getTheatersForMovie(movie.id) };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `Payment — ${loaderData.movie.title}` : "Payment" }],
  }),
  component: PaymentPage,
});

const CONVENIENCE = 35;

function PaymentPage() {
  const { movie, theaters } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const theater = theaters.find((t) => t.id === search.theater) ?? theaters[0];
  const seats = search.seats.split(",").filter(Boolean);
  const subtotal = seats.length * search.price;
  const total = subtotal + CONVENIENCE;

  const [method, setMethod] = useState<"credit" | "debit" | "upi">("credit");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState<null | { id: string }>(null);

  // Card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const validCard = () =>
    cardNumber.replace(/\s/g, "").length >= 12 &&
    cardName.trim().length > 1 &&
    /^\d{2}\/\d{2}$/.test(cardExpiry) &&
    /^\d{3,4}$/.test(cardCvv);

  const validUpi = () => /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId);

  const pay = async () => {
    if (method === "upi" ? !validUpi() : !validCard()) {
      toast.error("Please enter valid payment details.");
      return;
    }
    setProcessing(true);
    // Simulate gateway round-trip
    await new Promise((r) => setTimeout(r, 1800));
    const id = `BMS${Date.now().toString().slice(-8)}`;
    setProcessing(false);
    setDone({ id });
    toast.success("Payment successful!", { description: `Booking ID ${id}` });
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Toaster />
        <main className="container mx-auto max-w-2xl px-4 py-12 md:px-6">
          <Card className="border-[hsl(142_71%_45%)]/40">
            <CardHeader className="items-center text-center">
              <CheckCircle2 className="h-14 w-14 text-[hsl(142_71%_45%)]" />
              <CardTitle className="mt-2 text-2xl">Booking Confirmed</CardTitle>
              <p className="text-sm text-muted-foreground">A confirmation has been sent to your registered email.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-dashed border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Booking ID</span>
                  <span className="font-mono text-sm font-semibold">{done.id}</span>
                </div>
                <Separator className="my-3" />
                <p className="text-lg font-semibold">{movie.title}</p>
                <p className="text-sm text-muted-foreground">
                  {theater.name} · {theater.area}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary">{search.time}</Badge>
                  <Badge variant="outline">{search.format}</Badge>
                  <Badge>{seats.length} seat{seats.length > 1 ? "s" : ""}</Badge>
                </div>
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground">Seats: </span>
                  <span className="font-semibold">{seats.join(", ")}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-sm">
                  <span>Total Paid</span>
                  <span className="text-lg font-bold">₹{total}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/">Back to Home</Link>
                </Button>
                <Button className="flex-1" onClick={() => window.print()}>
                  <Ticket className="mr-2 h-4 w-4" /> Download Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Toaster />
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted-foreground" onClick={() => navigate({ to: "/" })}>
          <Link
            to="/movies/$movieId/seats"
            params={{ movieId: String(movie.id) }}
            search={{ tickets: seats.length || 1, theater: theater.id, time: search.time, format: search.format, price: search.price }}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to seats
          </Link>
        </Button>

        <h1 className="mt-4 text-2xl font-bold md:text-3xl">Complete Payment</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose a payment method to confirm your booking.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={method} onValueChange={(v) => setMethod(v as typeof method)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="credit"><CreditCard className="mr-2 h-4 w-4" />Credit Card</TabsTrigger>
                  <TabsTrigger value="debit"><Wallet className="mr-2 h-4 w-4" />Debit Card</TabsTrigger>
                  <TabsTrigger value="upi"><Smartphone className="mr-2 h-4 w-4" />UPI</TabsTrigger>
                </TabsList>

                <TabsContent value="credit" className="mt-6 space-y-4">
                  <CardForm
                    {...{ cardNumber, setCardNumber, cardName, setCardName, cardExpiry, setCardExpiry, cardCvv, setCardCvv }}
                  />
                </TabsContent>
                <TabsContent value="debit" className="mt-6 space-y-4">
                  <CardForm
                    {...{ cardNumber, setCardNumber, cardName, setCardName, cardExpiry, setCardExpiry, cardCvv, setCardCvv }}
                  />
                </TabsContent>
                <TabsContent value="upi" className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upi">UPI ID</Label>
                    <Input id="upi" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                    <p className="text-xs text-muted-foreground">A collect request will be sent to your UPI app.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <img src={movie.poster} alt={movie.title} className="h-24 w-16 rounded-md object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{movie.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />{theater.name}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />{search.time} · {search.format}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="text-sm">
                <p className="text-muted-foreground">Seats ({seats.length})</p>
                <p className="font-semibold">{seats.join(", ") || "—"}</p>
              </div>
              <Separator />
              <div className="space-y-1 text-sm">
                <Row label={`Tickets (${seats.length} × ₹${search.price})`} value={`₹${subtotal}`} />
                <Row label="Convenience fee" value={`₹${CONVENIENCE}`} />
              </div>
              <Separator />
              <Row label="Total Payable" value={`₹${total}`} bold />
              <Button className="w-full" size="lg" disabled={processing} onClick={pay}>
                {processing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>
                ) : (
                  <>Pay ₹{total}</>
                )}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                This is a simulated payment. No real charge will be made.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-base font-bold" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

interface CardFormProps {
  cardNumber: string; setCardNumber: (v: string) => void;
  cardName: string; setCardName: (v: string) => void;
  cardExpiry: string; setCardExpiry: (v: string) => void;
  cardCvv: string; setCardCvv: (v: string) => void;
}

function CardForm({ cardNumber, setCardNumber, cardName, setCardName, cardExpiry, setCardExpiry, cardCvv, setCardCvv }: CardFormProps) {
  const formatNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="card">Card Number</Label>
        <Input id="card" inputMode="numeric" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(formatNumber(e.target.value))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name on Card</Label>
        <Input id="name" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="exp">Expiry</Label>
          <Input id="exp" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" type="password" inputMode="numeric" placeholder="•••" maxLength={4} value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} />
        </div>
      </div>
    </>
  );
}