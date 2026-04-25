"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/lib/theme";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.replace("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-stone-800 mb-1">Journal</h1>
        <p className="text-stone-500 text-sm mb-8">Sign in to continue writing.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-stone-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none ${t.focusBorder} bg-white`}
            />
          </div>

          <div>
            <label className="block text-sm text-stone-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none ${t.focusBorder} bg-white`}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${t.btnPrimary} text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          No account?{" "}
          <Link href="/register" className={`${t.text600} hover:underline`}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
