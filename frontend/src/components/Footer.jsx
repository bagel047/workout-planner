import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Dumbbell } from "lucide-react";
import { FaInstagram, FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import logo_white from "../assets/logo_white.png";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer
      style={{
        background: "#0d0d0d",
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-24 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={logo_white} alt="Logo" className="h-7 mb-5 opacity-90" />
            <p className="text-white/35 text-sm leading-relaxed max-w-xs">
              Build structured workout plans, log your sessions, and let AI
              generate a program tailored to your goals.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                style={{ border: "0.5px solid rgba(255,255,255,0.1)" }}
              >
                <FaInstagram className="w-4 h-4 text-white/40" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                style={{ border: "0.5px solid rgba(255,255,255,0.1)" }}
              >
                <FaFacebook className="w-4 h-4 text-white/40" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                style={{ border: "0.5px solid rgba(255,255,255,0.1)" }}
              >
                <FaGithub className="w-4 h-4 text-white/40" />
              </a>
              <a
                href="https://google.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                style={{ border: "0.5px solid rgba(255,255,255,0.1)" }}
              >
                <FaGoogle className="w-4 h-4 text-white/40" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/25 mb-5">
              Features
            </p>
            <div className="flex flex-col gap-3">
              {[
                { to: "/exercises", label: "Exercise Library" },
                { to: "/plans", label: "Workout Plans" },
                { to: "/sessions", label: "Session Logging", protected: true },
                { to: "/generate", label: "AI Generation", protected: true },
                {
                  to: "/progress",
                  label: "Progress Tracking",
                  protected: true,
                },
              ].map(
                (link) =>
                  (!link.protected || user) && (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-sm text-white/40 hover:text-white/70 transition-colors w-fit"
                    >
                      {link.label}
                    </Link>
                  ),
              )}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/25 mb-5">
              Account
            </p>
            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors w-fit"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/plans/myplans"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors w-fit"
                  >
                    My Plans
                  </Link>
                  <Link
                    to="/sessions"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors w-fit"
                  >
                    My Sessions
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors w-fit"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors w-fit"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-[11px] text-white/20">
            © {new Date().getFullYear()} Workout Planner. Built with Spring Boot
            & React.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-white/20">
            <Dumbbell className="w-3 h-3 text-white/20" />
          </div>
        </div>
      </div>
    </footer>
  );
}
