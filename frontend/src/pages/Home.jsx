import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import bgImage from "../assets/1bg.jpg";
import bg2 from "../assets/2bg.jpg";
import bg3 from "../assets/3bg.jpg";
import {
  Dumbbell,
  ClipboardList,
  Sparkles,
  BarChart2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    name: "Exercise Library",
    description:
      "Browse 25+ exercises across all muscle groups or build your own. Every movement categorized by muscle, equipment, and difficulty.",
    icon: Dumbbell,
    number: "01",
    bg: null,
  },
  {
    name: "Workout Plans",
    description:
      "Structure your week with day-by-day plans. Define sets, reps, rest time, and target weight for every movement.",
    icon: ClipboardList,
    number: "02",
    bg: bg2,
  },
  {
    name: "AI Plan Generation",
    description:
      "Tell us your goal, experience level, and available equipment. Our AI builds a complete, personalized training plan in seconds.",
    icon: Sparkles,
    number: "03",
    bg: null,
  },
  {
    name: "Progress Tracking",
    description:
      "Log every session. See how your actual performance compares to what was planned: weight, reps, effort, all in one view.",
    icon: BarChart2,
    number: "04",
    bg: bg3,
  },
];

function ParallaxBg({ src }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.parentElement.getBoundingClientRect();
      const scrolled = -rect.top * 0.4;
      el.style.transform = `translateY(${scrolled}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 bg-cover bg-center scale-110"
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}

function FeatureRow({ feature, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      },
      { threshold: 0.25 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;
  const showImage = !!feature.bg;

  return (
    <div
      ref={ref}
      className="feature-row relative min-h-screen flex items-center overflow-hidden"
    >
      {showImage ? (
        <>
          <ParallaxBg src={feature.bg} />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}

      <div
        className={`relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-24 flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-20`}
      >
        <div className="flex-1 text-white feature-text">
          <span className="text-[8rem] font-bold leading-none text-white/5 block -mb-6 select-none">
            {feature.number}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#f8f4ee] mb-6 leading-tight">
            {feature.name}
          </h2>
          <p className="text-lg text-white/50 leading-relaxed max-w-md">
            {feature.description}
          </p>
        </div>
        <div className="flex-1 flex justify-center feature-visual">
          <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-2xl border border-white/10 flex items-center justify-center bg-white/[0.03]">
            <feature.icon
              className="w-20 h-20 text-[#e4ddcc]/40"
              strokeWidth={0.8}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <style>{`
                .feature-row {
                    opacity: 0;
                    transform: translateY(32px);
                    transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1);
                }
                .feature-row.revealed {
                    opacity: 1;
                    transform: translateY(0);
                }
                .feature-text { transition-delay: 0.05s; }
                .feature-visual { transition-delay: 0.2s; }
                .feature-row + .feature-row::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 6rem;
                    right: 6rem;
                    height: 1px;
                    background: rgba(255,255,255,0.06);
                }
                @media (prefers-reduced-motion: reduce) {
                    .feature-row {
                        opacity: 1;
                        transform: none;
                        transition: none;
                    }
                }
            `}</style>

      {/* Hero */}
      <div className="relative h-screen w-full overflow-hidden">
        <ParallaxBg src={bgImage} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.05] mb-6 max-w-3xl text-[#f8f4ee]">
            Train smarter.
            <br />
            Track everything.
          </h1>
          <p className="text-base text-white/40 max-w-md mb-12 leading-relaxed">
            Build structured workout plans, log your sessions, and let AI
            generate a program tailored to your goals.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            {user ? (
              <Link to="/plans">
                <Button size="lg" variant="secondary" className="gap-2">
                  Go to your plans <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Get started free <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    Log in
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
          </div>
        </div>
      </div>

      <div className="bg-black h-24 -mt-1" />

      {/* Features */}
      <div className="bg-black">
        {features.map((feature, index) => (
          <FeatureRow key={feature.name} feature={feature} index={index} />
        ))}
      </div>

      <div className="relative min-h-[70vh] flex items-center justify-center text-center px-6 overflow-hidden bg-black">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.35em] text-white/30 mb-6">
            Start today
          </p>
          <h2 className="text-4xl lg:text-6xl font-bold text-[#f8f4ee] mb-6 leading-tight">
            Ready to start?
          </h2>
          <p className="text-white/40 text-base mb-10 max-w-sm mx-auto leading-relaxed">
            Get your first AI-generated plan in under a minute.
          </p>
          {!user && (
            <Link to="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Create free account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
