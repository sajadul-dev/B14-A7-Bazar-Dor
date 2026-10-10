"use client";

import Link from "next/link";

import SignOutButton from "./SignOutButton";

export default function ProfilePanel({ user }) {
  const name = user?.name || "ব্যবহারকারী";
  const email = user?.email || "";

  const initial = name.trim().charAt(0) || "U";

  return (
    <section className="mx-auto w-full max-w-2xl py-6 sm:py-10">
      {/* Page Heading */}
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          আমার প্রোফাইল
        </h1>

        <p className="mt-1 text-xs text-muted sm:text-sm">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </div>

      {/* Account Information */}
      <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-xl font-extrabold text-bazar-green">
            {initial}
          </div>

          <div className="min-w-0">
            <h2 className="break-words text-base font-bold text-ink">
              {name}
            </h2>

            <p className="mt-1 break-all text-xs text-muted sm:text-sm">
              {email}
            </p>
          </div>
        </div>

        <SignOutButton
          className="shrink-0 rounded-lg border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 sm:text-sm"
        />
      </div>

      {/* Information Section */}
      <div className="mt-5 rounded-xl border border-line bg-surface p-4 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-ink">
          তথ্য
        </h2>

        <div className="mt-4">
          <p className="text-xs font-medium text-muted">
            নাম
          </p>

          <p className="mt-1 text-sm font-semibold text-ink">
            {name}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-muted">
            ইমেইল
          </p>

          <p className="mt-1 break-all text-sm text-ink">
            {email}
          </p>
        </div>

        <Link
          href="/profile/update"
          className="mt-5 flex min-h-10 w-full items-center justify-center rounded-lg bg-bazar-green px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-bazar-green-dark sm:w-auto"
        >
          তথ্য আপডেট করুন
        </Link>
      </div>
    </section>
  );
}