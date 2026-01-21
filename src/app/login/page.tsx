"use client";

import { useActionState } from "react";
// import { authenticate } from "@/app/lib/actions"; // We'll verify this
// For now, let's implement the form directly with server action calling signIn
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials.");
      } else {
        router.push("/admin"); // Redirect to admin dashboard (to be created) or home
        router.refresh();
      }
    } catch (e) {
      setError("Something went wrong.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[var(--cherry-bg)]">
      <div className="terminal-card w-full max-w-md p-8 glow-green border-[var(--cherry-green)]">
        <h1 className="text-3xl font-pixel text-center mb-8 text-[var(--cherry-green)] typing-effect inline-block border-r-2 border-[var(--cherry-green)] pr-2">
          Admin Login
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 font-code">
          <div>
            <label className="block text-sm mb-2 text-[var(--cherry-text)]">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              className="w-full bg-black/30 border border-[var(--cherry-muted)] rounded p-3 text-[var(--cherry-text)] focus:border-[var(--cherry-green)] focus:outline-none focus:ring-1 focus:ring-[var(--cherry-green)] transition-all"
              placeholder="root"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-2 text-[var(--cherry-text)]">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-black/30 border border-[var(--cherry-muted)] rounded p-3 text-[var(--cherry-text)] focus:border-[var(--cherry-green)] focus:outline-none focus:ring-1 focus:ring-[var(--cherry-green)] transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-[var(--cherry-red)] text-sm border border-[var(--cherry-red)] p-2 rounded bg-[var(--cherry-red)]/10">
              ➜ Error: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[var(--cherry-green)]/10 border border-[var(--cherry-green)] text-[var(--cherry-green)] py-3 px-4 rounded hover:bg-[var(--cherry-green)] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isPending ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <span>Access System</span>
                <span className="group-hover:translate-x-1 transition-transform">➜</span>
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--cherry-muted)] opacity-30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[var(--cherry-bg-secondary)] px-2 text-[var(--cherry-muted)]">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 font-code">
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/admin" })}
            className="w-full bg-[#24292e] text-white border border-[var(--cherry-muted)] py-3 px-4 rounded hover:bg-black transition-all flex items-center justify-center gap-2 group"
          >
            <span>GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/admin" })}
            className="w-full bg-white text-black border border-[var(--cherry-muted)] py-3 px-4 rounded hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Google</span>
          </button>
        </div>
      </div>
    </main>
  );
}
