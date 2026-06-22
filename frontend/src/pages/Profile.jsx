import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosInstance";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Trash2,
  Save,
  X,
  Check,
  LogOut,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ACTIVE = "#c8f135";

function SectionCard({ title, children }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.08)",
      }}
    >
      <h2 className="text-sm font-semibold text-[#f8f4ee] mb-5">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
  type = "text",
  placeholder,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-widest text-white/30">
        {label}
      </label>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#f8f4ee] placeholder:text-white/20 focus:outline-none transition-colors"
          onFocus={(e) => (e.target.style.borderColor = ACTIVE)}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
      ) : (
        <p className="text-[#f8f4ee] text-sm py-2.5 px-1">
          {value || <span className="text-white/25">Not set</span>}
        </p>
      )}
    </div>
  );
}

export default function Profile() {
  s;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    displayName: "",
    avatarUrl: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/users/me");
        console.log(res);
        setProfile(res.data);
        setProfileForm({
          displayName: res.data.displayName || "",
          avatarUrl: res.data.avatarUrl || "",
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await axiosInstance.put("/users/me", profileForm);
      setProfile(res.data);
      setEditingProfile(false);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const validatePassword = () => {
    const e = {};
    if (!passwordForm.currentPassword)
      e.currentPassword = "Current password is required";
    if (passwordForm.newPassword.length < 6)
      e.newPassword = "New password must be at least 6 characters";
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setPasswordErrors(e);
    return Object.keys(e).length === 0;
  };

  const savePassword = async () => {
    if (!validatePassword()) return;
    setSavingPassword(true);
    try {
      await axiosInstance.put("/users/me/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setEditingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const deleteAccount = async () => {
    try {
      await axiosInstance.delete("/users/me");
      logout();
      navigate("/");
      toast.success("Account deleted");
    } catch {
      toast.error("Failed to delete account");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-white/15 rounded-full animate-spin"
          style={{ borderTopColor: ACTIVE }}
        />
      </div>
    );

  const isLocal = profile?.provider === "LOCAL";
  const initials = (profile?.displayName || profile?.username || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-24 px-6 lg:px-24">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-5 mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{
              background: `${ACTIVE}15`,
              border: `0.5px solid ${ACTIVE}30`,
              color: ACTIVE,
            }}
          >
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="avatar"
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-1">
              Your account
            </p>
            <h1 className="text-2xl font-bold text-[#f8f4ee]">
              {profile?.displayName || profile?.username}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(248,244,238,0.45)",
                }}
              >
                {profile?.role}
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  background: isLocal
                    ? "rgba(200,241,53,0.1)"
                    : "rgba(126,184,212,0.1)",
                  color: isLocal ? ACTIVE : "#7eb8d4",
                }}
              >
                <Shield className="w-2.5 h-2.5" />
                {profile?.provider}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SectionCard title="Profile information">
            <div className="flex flex-col gap-4">
              <Field
                label="Username"
                value={profile?.username}
                editing={false}
              />
              <Field label="Email" value={profile?.email} editing={false} />
              <Field
                label="Display name"
                value={
                  editingProfile
                    ? profileForm.displayName
                    : profile?.displayName
                }
                editing={editingProfile}
                onChange={(v) =>
                  setProfileForm((f) => ({ ...f, displayName: v }))
                }
                placeholder="Your display name"
              />
              <Field
                label="Avatar URL"
                value={
                  editingProfile ? profileForm.avatarUrl : profile?.avatarUrl
                }
                editing={editingProfile}
                onChange={(v) =>
                  setProfileForm((f) => ({ ...f, avatarUrl: v }))
                }
                placeholder="https://..."
              />

              {editingProfile ? (
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={saveProfile}
                    disabled={savingProfile}
                    size="sm"
                    className="gap-2"
                    style={{ background: ACTIVE, color: "#1a1a1a" }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {savingProfile ? "Saving..." : "Save changes"}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingProfile(false);
                      setProfileForm({
                        displayName: profile?.displayName || "",
                        avatarUrl: profile?.avatarUrl || "",
                      });
                    }}
                    size="sm"
                    variant="outline"
                    className="border-white/15 text-white/50 bg-transparent"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="text-xs text-white/35 hover:text-white/60 transition-colors text-left mt-1 w-fit"
                >
                  Edit profile →
                </button>
              )}
            </div>
          </SectionCard>

          {/* password - for local accounts */}
          {isLocal && (
            <SectionCard title="Password">
              {editingPassword ? (
                <div className="flex flex-col gap-3">
                  {[
                    { key: "currentPassword", label: "Current password" },
                    { key: "newPassword", label: "New password" },
                    { key: "confirmPassword", label: "Confirm new password" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="text-[10px] uppercase tracking-widest text-white/30 block mb-1.5">
                        {f.label}
                      </label>
                      <input
                        type="password"
                        value={passwordForm[f.key]}
                        onChange={(e) => {
                          setPasswordForm((p) => ({
                            ...p,
                            [f.key]: e.target.value,
                          }));
                          if (passwordErrors[f.key])
                            setPasswordErrors((p) => ({ ...p, [f.key]: null }));
                        }}
                        className="w-full bg-white/[0.05] border rounded-lg px-4 py-2.5 text-sm text-[#f8f4ee] focus:outline-none transition-colors"
                        style={{
                          borderColor: passwordErrors[f.key]
                            ? "#ef4444"
                            : "rgba(255,255,255,0.1)",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = ACTIVE)}
                        onBlur={(e) =>
                          (e.target.style.borderColor = passwordErrors[f.key]
                            ? "#ef4444"
                            : "rgba(255,255,255,0.1)")
                        }
                      />
                      {passwordErrors[f.key] && (
                        <p className="text-xs text-red-400 mt-1">
                          {passwordErrors[f.key]}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2 mt-1">
                    <Button
                      onClick={savePassword}
                      disabled={savingPassword}
                      size="sm"
                      className="gap-2"
                      style={{ background: ACTIVE, color: "#1a1a1a" }}
                    >
                      <Check className="w-3.5 h-3.5" />
                      {savingPassword ? "Changing..." : "Change password"}
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingPassword(false);
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setPasswordErrors({});
                      }}
                      size="sm"
                      variant="outline"
                      className="border-white/15 text-white/50 bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-white/25" />
                    <span className="text-sm text-white/40">••••••••••••</span>
                  </div>
                  <button
                    onClick={() => setEditingPassword(true)}
                    className="text-xs text-white/35 hover:text-white/60 transition-colors"
                  >
                    Change →
                  </button>
                </div>
              )}
            </SectionCard>
          )}

          <SectionCard title="Account">
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all hover:bg-white/[0.05]"
                style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4 text-white/30" />
                  <span className="text-sm text-[#f8f4ee]">Log out</span>
                </div>
                <span className="text-white/20 text-xs">→</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all hover:bg-red-500/10"
                style={{ border: "0.5px solid rgba(239,68,68,0.2)" }}
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4 text-red-400/60" />
                  <span className="text-sm text-red-400/80">
                    Delete account
                  </span>
                </div>
                <span className="text-red-400/30 text-xs">→</span>
              </button>
            </div>
          </SectionCard>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5 text-center"
            style={{
              background: "#1c1c1e",
              border: "0.5px solid rgba(239,68,68,0.3)",
            }}
          >
            <Trash2 className="w-8 h-8 text-red-400 mx-auto" />
            <div>
              <h3 className="text-[#f8f4ee] font-semibold text-base mb-1">
                Delete your account?
              </h3>
              <p className="text-white/40 text-sm">
                All your plans, sessions and exercises will be permanently
                deleted. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={deleteAccount}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white border-none"
              >
                Yes, delete everything
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1 border-white/15 text-white/50 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
