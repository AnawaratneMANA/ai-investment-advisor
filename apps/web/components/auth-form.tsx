"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await register({ email, password });
      }
      router.replace("/");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to continue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium text-primary">AI Investment Advisor</p>
        <h1 className="text-2xl font-semibold tracking-tight">{isLogin ? "Welcome back" : "Create your account"}</h1>
        <p className="text-sm text-muted-foreground">
          {isLogin ? "Sign in to continue to your research workspace." : "Set up the first account for this private workspace."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm font-medium" htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 font-normal outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium" htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={isLogin ? 1 : 8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 font-normal outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isLogin ? "Need an account? " : "Already have an account? "}
        <Link className="font-medium text-primary hover:underline" href={isLogin ? "/register" : "/login"}>
          {isLogin ? "Create one" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}

