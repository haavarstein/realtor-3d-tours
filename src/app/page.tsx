import Image from "next/image";
import Link from "next/link";
import { Camera, Upload, Share2, Sparkles, ShieldCheck, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const HERO_IMG =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <CtaBanner />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_IMG}
          alt="Modern living room"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:py-28">
        <Badge variant="secondary" className="mb-5 gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> New: AI-powered 3D capture
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Turn a phone walkthrough into a{" "}
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            3D virtual tour
          </span>{" "}
          in minutes.
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          Just record a quick video walking through the property. Upload it
          here. We&apos;ll generate a stunning, shareable 3D tour your buyers
          can explore from anywhere.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:max-w-md">
          <Link
            href="/upload"
            className={buttonVariants({ size: "lg", className: "h-14 text-base shadow-lg" })}
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload Video
          </Link>
          <Link
            href="/tour/demo"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "h-12",
            })}
          >
            View a sample tour
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Works on any phone &middot; No app to install &middot; Up to 200&nbsp;MB
        </p>
      </div>
    </section>
  );
}

const STEPS = [
  {
    icon: Camera,
    title: "Walk through the property",
    body: "Open the camera on your phone and slowly walk every room, top to bottom. 60–120 seconds is plenty.",
  },
  {
    icon: Upload,
    title: "Upload your video",
    body: "Tap one button. We accept any standard phone video up to 200 MB.",
  },
  {
    icon: Share2,
    title: "Share the 3D tour",
    body: "We generate an interactive 3D tour and give you a link plus an embed code for your listing site.",
  },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>
        <p className="mt-3 text-muted-foreground">
          From phone video to immersive 3D listing in three steps.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <Card key={step.title} className="h-full">
            <CardContent className="flex h-full flex-col items-start gap-3 p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

const BENEFITS = [
  {
    icon: Clock,
    title: "Faster than scheduling a photographer",
    body: "List the property the same day you visit it. No third-party booking, no waiting on edits.",
  },
  {
    icon: ShieldCheck,
    title: "Buyers self-qualify before booking",
    body: "Serious buyers spend more time in the tour. You spend less time on no-show showings.",
  },
  {
    icon: Sparkles,
    title: "Stand out in your market",
    body: "Properties with 3D tours get measurably more clicks, saves, and inquiries than flat photos.",
  },
];

function Benefits() {
  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for the way you actually work
          </h2>
          <p className="mt-3 text-muted-foreground">
            Realtor3D fits into your existing flow — phone, listing, done.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "I shot the video on my way out of the showing. By the time I got to my car the tour link was ready to send.",
    name: "Maya R.",
    role: "Broker, Miami",
  },
  {
    quote:
      "My buyers tell me they feel like they've already been inside. We're closing faster and skipping unnecessary visits.",
    name: "Tomás A.",
    role: "Realtor, São Paulo",
  },
  {
    quote:
      "Replaced a $400 3D-tour vendor invoice with a 60-second phone clip. Same listing engagement.",
    name: "Jordan K.",
    role: "Independent agent",
  },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Brokers are shipping listings faster
        </h2>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <Card key={t.name}>
            <CardContent className="flex h-full flex-col gap-4 p-6">
              <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-auto">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-8 text-center sm:p-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Your next listing is one video away.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Try it on a property you&apos;re already working on. No signup
          required for your first tour.
        </p>
        <Link
          href="/upload"
          className={buttonVariants({
            size: "lg",
            className: "mt-6 h-14 px-8 text-base shadow-lg",
          })}
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload Video
        </Link>
      </div>
    </section>
  );
}
