import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo_white from "../assets/white_logo_resized_cropped.png";
import logo_black from "../assets/black_logo_resized_cropped.png";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  Dumbbell,
  Sparkles,
  BarChart2,
  ClipboardList,
  PlayCircle,
  User,
  LogOut,
} from "lucide-react";

const features = [
  {
    name: "Exercise Library",
    description:
      "Browse 25+ exercises across all muscle groups or create your own",
    icon: Dumbbell,
    href: "/exercises",
  },
  {
    name: "Workout Plans",
    description: "Build structured workout plans with days and exercises",
    icon: ClipboardList,
    href: "/plans",
  },
  {
    name: "AI Plan Generation",
    description: "Tell us your goals and let AI build the perfect plan for you",
    icon: Sparkles,
    href: "/generate",
  },
  {
    name: "Progress Tracking",
    description: "Log sessions and compare your performance against your plan",
    icon: BarChart2,
    href: "/sessions",
  },
];

const callsToAction = [
  { name: "See how it works", icon: PlayCircle, href: "#how-it-works" },
];

export default function Header() {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const lightHeaderRoutes = [];
  const isLightPage = !lightHeaderRoutes.includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // const [scrolled, setScrolled] = useState(false);

  // useEffect(() => {
  //   const onScroll = () => setScrolled(window.scrollY > 600);
  //   window.addEventListener("scroll", onScroll);
  //   return () => window.removeEventListener("scroll", onScroll);
  // }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full p-6 lg:px-8 z-90 ${isLightPage ? "text-white" : "text-primary"}`}
      style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
      }}
    >
      <nav className="mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/">
            <img
              className="w-12 h-6"
              src={isLightPage ? logo_white : logo_black}
              alt="Logo"
            />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex lg:gap-x-10 items-center">
          <>
            <Link
              to="/exercises"
              className="text-sm font-medium hover:opacity-80 transition-colors"
            >
              Exercises
            </Link>
            <Link
              to="/plans"
              className="text-sm font-medium hover:opacity-80 transition-colors"
            >
              Plans
            </Link>

            <Link
              to="/sessions"
              className="text-sm font-medium hover:opacity-80 transition-colors"
            >
              Sessions
            </Link>
            <Link to="/generate">
              <Button
                size="sm"
                className={`gap-1.5 hover:opacity-80 hover:text-white ${isLightPage ? "text-primary bg-white" : "text-white bg-primary"}`}
              >
                <Sparkles className="h-4 w-4" />
                AI Generate
              </Button>
            </Link>
          </>
        </div>

        {/* Right side */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user ? (
            // User dropdown
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-white/20">
                      {user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.username}</span>
                  <ChevronDownIcon className="h-4 w-4 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} variant="destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium hover:opacity-80 transition-colors"
              >
                Log in
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  variant="secondary"
                  className={`${isLightPage ? "" : "bg-primary text-white hover:bg-primary hover:opacity-80"}`}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-40 w-full overflow-y-auto bg-primary px-6 py-4 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <Link to="/" className="font-bold text-xl">
                <img src={logo_white} alt="Logo" className="h-8" />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root text-white">
              {user ? (
                <div className="space-y-1 py-6">
                  <Link
                    to="/exercises"
                    className="block rounded-lg px-3 py-2 text-base font-medium hover:opacity-70 transition-opacity"
                    onClick={() => setMobileOpen(false)}
                  >
                    Exercises
                  </Link>
                  <Link
                    to="/plans"
                    className="block rounded-lg px-3 py-2 text-base font-medium hover:opacity-70 transition-opacity"
                    onClick={() => setMobileOpen(false)}
                  >
                    Plans
                  </Link>
                  <Link
                    to="/sessions"
                    className="block rounded-lg px-3 py-2 text-base font-medium hover:opacity-70 transition-opacity"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sessions
                  </Link>
                  <Link
                    to="/generate"
                    className="block rounded-lg px-3 py-2 text-base font-medium hover:opacity-70 transition-opacity"
                    onClick={() => setMobileOpen(false)}
                  >
                    AI Generate
                  </Link>
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <p className="px-3 text-sm opacity-60">{user.username}</p>
                    <Link
                      to="/profile"
                      className="block rounded-lg px-3 py-2 text-base font-medium hover:opacity-70 transition-opacity"
                      onClick={() => setMobileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left rounded-lg px-3 py-2 text-base font-medium text-red-400 hover:opacity-70 transition-opacity"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="block rounded-lg px-3 py-2 text-base font-medium hover:opacity-70 transition-opacity"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" size="sm" variant="secondary">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
