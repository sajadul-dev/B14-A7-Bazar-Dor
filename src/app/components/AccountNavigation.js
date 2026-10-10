"use client";

import Link from "next/link";

import { useSession } from "@/lib/auth-client";
import ProfileMenu from "./ProfileMenu";

export default function AccountNavigation() {
  const { data: session, isPending } = useSession();

  // Session check চলার সময় Navbar-এর জায়গা বজায় রাখবে।
  if (isPending) {
    return (
      <div
        className="h-9 w-36 shrink-0"
        aria-label="অ্যাকাউন্ট লোড হচ্ছে"
      />
    );
  }

  // Login করা থাকলে Profile Menu দেখাবে।
  if (session?.user) {
    return <ProfileMenu user={session.user} />;
  }

  // Login করা না থাকলে Sign In ও Sign Up দেখাবে।
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Link
        href="/signin"
        className="rounded-lg px-2 py-2 text-xs font-semibold text-ink transition hover:text-bazar-green sm:px-3"
      >
        সাইন ইন
      </Link>

      <Link
        href="/signup"
        className="rounded-lg bg-bazar-green px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-bazar-green-dark sm:px-4"
      >
        সাইন আপ
      </Link>
    </div>
  );
}