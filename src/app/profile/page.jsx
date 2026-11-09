"use client";

import { useEffect, useState } from "react";
import { Barlow, Satisfy } from "next/font/google";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const satisfy = Satisfy({ subsets: ["latin"], weight: ["400"] });

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    isDriver: false,
  });

  // Sync form with user data when session loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        image: user.image || "",
        isDriver: user.isDriver || false,
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const { data, error } = await authClient.updateUser({
        name: formData.name,
        image: formData.image,
        // Note: custom fields are passed in a specific way depending on better-auth version,
        // usually as top level if defined in additionalFields
        isDriver: formData.isDriver,
      });

      if (error) throw new Error(error.message);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  const getVibe = (id) => {
    const vibes = [
      {
        title: "The Executive",
        car: "Mercedes S-Class",
        color: "from-slate-700 to-slate-900",
        emoji: "💼",
        desc: "Sophisticated, powerful, and always in control.",
      },
      {
        title: "The Explorer",
        car: "Jeep Wrangler",
        color: "from-green-600 to-emerald-900",
        emoji: "🏔️",
        desc: "Fearless, adventurous, and loves the open trail.",
      },
      {
        title: "The Speedster",
        car: "Porsche 911",
        color: "from-red-500 to-red-800",
        emoji: "🏎️",
        desc: "Fast, precise, and lives for the adrenaline.",
      },
      {
        title: "The Urbanite",
        car: "Tesla Model 3",
        color: "from-blue-400 to-indigo-700",
        emoji: "⚡",
        desc: "Modern, sustainable, and tech-forward.",
      },
    ];
    const index = id ? id.charCodeAt(0) % vibes.length : 0;
    return vibes[index];
  };

  if (isPending)
    return (
      <div className="min-h-screen bg-[#060b14] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen bg-[#060b14] flex items-center justify-center text-white">
        Please log in.
      </div>
    );

  const vibe = getVibe(user.id);

  return (
    <main
      className={`${barlow.className} min-h-screen bg-[#060b14] text-white px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden`}
    >
      <Toaster position="top-center" />

      {/* Cinematic Background Animation */}
      <CarAnimationBackground />

      <div className="mx-auto max-w-4xl relative z-10">
        {/* --- PROFILE HEADER --- */}
        <section className="relative flex flex-col items-center text-center mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative h-32 w-32 rounded-full border-4 border-[#060b14] overflow-hidden bg-[#0a1424]">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-4xl font-bold text-blue-400">
                  {user.name?.[0] || "U"}
                </span>
              )}
            </div>
          </div>

          <h1
            className={`mt-6 text-4xl font-bold sm:text-5xl ${satisfy.className}`}
          >
            {isEditing ? (
              <input
                className="bg-transparent text-center border-b-2 border-blue-500 outline-none focus:ring-0 w-full max-w-sm"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            ) : (
              user.name || "RoadNest User"
            )}
          </h1>

          {!isEditing && (
            <p className="mt-2 text-slate-400 font-medium uppercase tracking-widest text-xs">
              Member of the Elite Drive Club
            </p>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-6 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold transition"
          >
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </button>
        </section>

        {/* --- EDITING FORM (Only visible when isEditing is true) --- */}
        {isEditing && (
          <section className="mb-16 p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Full Name
                </label>
                <input
                  className="h-11 rounded-lg bg-[#0e1b30] border border-white/10 px-3 text-white outline-none focus:border-blue-400"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Profile Image URL
                </label>
                <input
                  className="h-11 rounded-lg bg-[#0e1b30] border border-white/10 px-3 text-white outline-none focus:border-blue-400"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <input
                  type="checkbox"
                  id="isDriver"
                  className="w-5 h-5 accent-blue-500"
                  checked={formData.isDriver}
                  onChange={(e) =>
                    setFormData({ ...formData, isDriver: e.target.checked })
                  }
                />
                <label
                  htmlFor="isDriver"
                  className="text-sm font-medium text-slate-300 cursor-pointer"
                >
                  I am a registered driver
                </label>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSave}
                  className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-500/30"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        )}

        {/* --- INFO GRID --- */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          <InfoCard
            label="User ID"
            value={user.id.slice(0, 12) + "..."}
            icon="🆔"
          />
          <InfoCard label="Email" value={user.email} icon="✉️" />
          <InfoCard
            label="Role"
            value={user.isDriver ? "Professional Driver" : "Standard User"}
            icon="🚗"
            highlight={user.isDriver}
          />
        </section>

        {/* --- VIBE MATCHING SECTION --- */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Your Car Vibe</h2>
          <div
            className={`relative overflow-hidden rounded-3xl p-8 text-center transition-all duration-500 bg-gradient-to-br ${vibe.color} shadow-2xl shadow-black/40 border border-white/10`}
          >
            <div className="text-6xl mb-4">{vibe.emoji}</div>
            <h3 className="text-3xl font-bold text-white mb-2">{vibe.title}</h3>
            <p className="text-white/80 text-lg mb-6 max-w-md mx-auto">
              "{vibe.desc}"
            </p>
            <div className="inline-block px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold">
              Perfect Match: {vibe.car}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value, icon, highlight = false }) {
  return (
    <div
      className={`p-5 rounded-2xl border ${highlight ? "border-blue-500/50 bg-blue-500/5" : "border-white/10 bg-white/[0.03]"} transition-hover hover:bg-white/[0.06]`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">
          {label}
        </span>
      </div>
      <p className="text-sm font-semibold truncate text-slate-200">{value}</p>
    </div>
  );
}

// --- CINEMATIC CAR ANIMATION COMPONENT ---
function CarAnimationBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {/* Road Surface */}
      <div className="absolute bottom-0 w-full h-[20vh] bg-gradient-to-t from-slate-900 to-transparent border-t border-white/5" />

      {/* Animated Cars */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute bottom-10 w-32 h-12 rounded-lg transition-all duration-[10s] linear animate-drive"
          style={{
            left: `-150px`,
            animationDelay: `${i * 4}s`,
            backgroundColor:
              i === 1 ? "#3b82f6" : i === 2 ? "#ef4444" : "#10b981",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
            zIndex: i === 1 ? 10 : 5,
          }}
        >
          {/* Car Details */}
          <div className="absolute top-2 right-2 w-4 h-2 bg-white/30 rounded" />
          <div className="absolute bottom-0 left-2 w-3 h-3 bg-slate-800 rounded-full" />
          <div className="absolute bottom-0 right-2 w-3 h-3 bg-slate-800 rounded-full" />
        </div>
      ))}

      <style jsx>{`
        @keyframes drive {
          0% {
            transform: translateX(0vw);
          }
          100% {
            transform: translateX(120vw);
          }
        }
        .animate-drive {
          animation: drive 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
