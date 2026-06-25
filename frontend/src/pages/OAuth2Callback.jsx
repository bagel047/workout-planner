import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function OAuth2Callback() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token);
      setTimeout(() => navigate("/", { replace: true }), 100);
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 border-2 border-white/15 rounded-full animate-spin"
          style={{ borderTopColor: "#c8f135" }}
        />
        <p className="text-white/40 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
