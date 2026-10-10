"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

function GoogleLogo() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.14-3.09-.4-4.55H24v9.02h12.94c-.58 2.96-2.25 5.47-4.73 7.16l7.66 5.94c4.47-4.13 7.11-10.2 7.11-17.57Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.45 14.45 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.92 23.92 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.9-5.88l-7.66-5.94C30.12 37.82 27.29 38.75 24 38.75c-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0 text-[#181717]"
    >
      <path d="M12 .297a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.41 3-.42 1.02.01 2.04.15 3 .42 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .297z" />
    </svg>
  );
}

function SocialButton({ provider, label, onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-lg border border-line bg-white px-2 transition hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-60"
    >
      {provider === "google" ? <GoogleLogo /> : <GitHubLogo />}

      <span
        className="min-w-0 whitespace-nowrap text-ink"
        style={{
          fontSize: "10px",
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: "-0.25px",
        }}
      >
        {label}
      </span>
    </button>
  );
}

export default function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (name.trim().length < 2) {
      toast.error("কমপক্ষে ২ অক্ষরের নাম লিখুন।");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(
          result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।"
        );
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এবার সাইন ইন করুন।");
      router.push("/signin");
    } catch (error) {
      console.error("Sign-up error:", error);
      toast.error("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider) {
    setLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(
          result.error.message || "সোশ্যাল লগইন চালু করা যায়নি।"
        );
        setLoading(false);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error("Google/GitHub OAuth configuration পরীক্ষা করুন।");
      setLoading(false);
    }
  }

  const labelClass =
    "mb-1 block text-[11px] font-medium text-ink";

  const inputClass =
    "h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-bazar-green focus:ring-1 focus:ring-green-100";

  return (
    <section className="mx-auto w-full max-w-[390px]">
      <div className="mb-5 text-center">
        <h2 className="text-xl font-extrabold leading-tight text-ink sm:text-2xl">
          অ্যাকাউন্ট তৈরি করুন
        </h2>

        <p className="mt-1.5 text-xs leading-5 text-muted">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full rounded-xl border border-line bg-surface p-4 shadow-sm sm:p-5"
      >
        <div className="space-y-3.5">
          <div>
            <label htmlFor="signup-name" className={labelClass}>
              নাম
            </label>

            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="যেমন: রহিম উদ্দিন"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="signup-email" className={labelClass}>
              ইমেইল
            </label>

            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="signup-password" className={labelClass}>
              পাসওয়ার্ড
            </label>

            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="signup-confirm-password"
              className={labelClass}
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>

            <input
              id="signup-confirm-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="আবার লিখুন"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center rounded-md bg-bazar-green px-3 text-sm font-bold text-white shadow-sm transition hover:bg-bazar-green-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </div>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs text-muted">অথবা</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <div className="flex w-full items-center gap-2">
          <SocialButton
            provider="google"
            label="Google দিয়ে চালিয়ে যান"
            onClick={() => handleSocialLogin("google")}
            loading={loading}
          />

          <SocialButton
            provider="github"
            label="GitHub দিয়ে চালিয়ে যান"
            onClick={() => handleSocialLogin("github")}
            loading={loading}
          />
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="font-bold text-bazar-green hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </form>

      <div className="mt-4 text-center">
        <Link
          href="/"
          className="text-xs text-muted transition hover:text-bazar-green"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  );
}