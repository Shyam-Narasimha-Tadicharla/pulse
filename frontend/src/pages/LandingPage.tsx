import { useNavigate } from "react-router-dom";
import { LayoutGroup, motion } from "motion/react";
import { Shield, Lock, Database, CreditCard, BarChart2 } from "lucide-react";
import Hero from "@/components/ui/animated-shader-hero";
import { TextRotate } from "@/components/ui/text-rotate";
import RadialOrbitalTimeline, { type TimelineItem } from "@/components/ui/radial-orbital-timeline";
import { useAuth } from "@/context/AuthContext";

const pulseServices: TimelineItem[] = [
  {
    id: 1,
    title: "API Gateway",
    date: "Port 4004",
    content:
      "Single entry point for all traffic. Applies the JwtValidation filter to protected routes before forwarding to downstream services.",
    category: "Routing",
    icon: Shield,
    relatedIds: [2, 3],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Auth Service",
    date: "Port 4005",
    content:
      "Issues HMAC-SHA JWTs with 10-hour expiry. Validates tokens via GET /validate. Passwords BCrypt-hashed with Spring Security.",
    category: "Security",
    icon: Lock,
    relatedIds: [1],
    status: "completed",
    energy: 95,
  },
  {
    id: 3,
    title: "Entity Service",
    date: "Port 4000",
    content:
      "Core domain service. Manages Subject records via REST. On each change, triggers a gRPC call to Billing and publishes a Protobuf event to Kafka.",
    category: "Domain",
    icon: Database,
    relatedIds: [1, 4, 5],
    status: "completed",
    energy: 90,
  },
  {
    id: 4,
    title: "Billing Service",
    date: "gRPC :9001",
    content:
      "gRPC server implementing BillingService.CreateBillingAccount. Receives synchronous calls from Entity Service when subjects are registered.",
    category: "Billing",
    icon: CreditCard,
    relatedIds: [3],
    status: "completed",
    energy: 85,
  },
  {
    id: 5,
    title: "Analytics",
    date: "Port 4002",
    content:
      "Kafka consumer (group: analytics-service). Deserializes Protobuf SubjectEvent messages from the 'subject' topic for real-time analytics.",
    category: "Analytics",
    icon: BarChart2,
    relatedIds: [3],
    status: "in-progress",
    energy: 60,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const dest = token ? "/dashboard" : "/login";

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-black">
      {/* Floating header */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-white font-bold text-lg tracking-tight">
            pulse<span className="text-orange-500">.</span>
          </span>
        </div>
        <button
          onClick={() => navigate(dest)}
          className="px-5 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:text-orange-200 rounded-full text-sm font-medium transition-all"
        >
          {token ? "Dashboard" : "Sign In"} →
        </button>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <Hero
        trustBadge={{ text: "5 microservices · gRPC · Kafka · JWT", icons: ["⚡"] }}
        headline={{ line1: "Distributed.", line2: "Real-Time." }}
        subtitle="A production-grade microservices platform. Five independently deployable services communicating via REST, gRPC, and Kafka — all behind a single JWT-secured gateway."
        buttons={{
          primary: { text: "Open Dashboard", onClick: () => navigate(dest) },
          secondary: { text: "View Architecture", onClick: () => scrollTo("architecture") },
        }}
      />

      {/* ── Architecture ────────────────────────────────────────── */}
      <section id="architecture" className="relative h-screen bg-black overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-20 text-center pt-14 pointer-events-none">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-500/50 mb-3">Architecture</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">Five Services. One System.</h2>
          <p className="text-white/30 mt-3 text-sm">Click any node to explore connections</p>
        </div>
        <RadialOrbitalTimeline timelineData={pulseServices} />
      </section>

      {/* ── TextRotate tagline ───────────────────────────────────── */}
      <section className="bg-black py-40 flex items-center justify-center min-h-[50vh]">
        <div className="text-center px-4">
          <LayoutGroup>
            <motion.p
              className="flex flex-wrap items-baseline justify-center gap-x-3 text-4xl md:text-6xl font-light text-white"
              layout
            >
              <motion.span layout className="transition-all duration-300">
                Built to be
              </motion.span>
              <TextRotate
                texts={[
                  "distributed.",
                  "event-driven.",
                  "secure.",
                  "scalable.",
                  "observable.",
                  "production-ready.",
                ]}
                mainClassName="text-orange-400 font-semibold"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </motion.p>
          </LayoutGroup>
          <p className="mt-8 text-white/25 text-lg max-w-sm mx-auto">
            Five microservices. Three protocols. One gateway.
          </p>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-black border-t border-white/5 py-32 text-center px-4">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-500/50 mb-4">Get Started</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to explore?</h2>
        <p className="text-white/30 text-lg mb-10 max-w-md mx-auto">
          Sign in to manage subjects, trigger gRPC calls, and watch Kafka events flow in real time.
        </p>
        <button
          onClick={() => navigate(dest)}
          className="px-10 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20"
        >
          {token ? "Go to Dashboard" : "Sign In to Dashboard"} →
        </button>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-black border-t border-white/5 py-8 text-center">
        <p className="text-white/15 text-sm">
          pulse. — Spring Boot · gRPC · Apache Kafka · React
        </p>
      </footer>
    </div>
  );
}
