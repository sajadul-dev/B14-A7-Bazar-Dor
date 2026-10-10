"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function UpdateProfileForm({
  initialName,
}) {
  const router = useRouter();

  const [name, setName] = useState(initialName || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const updatedName = name.trim();

    if (updatedName.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }

    if (updatedName.length > 100) {
      toast.error("নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারবে।");
      return;
    }

    if (updatedName === initialName) {
      toast.error("আপনি কোনো পরিবর্তন করেননি।");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.updateUser({
        name: updatedName,
      });

      if (result.error) {
        toast.error(
          result.error.message || "তথ্য আপডেট করা যায়নি।"
        );
        return;
      }

      toast.success("আপনার তথ্য সফলভাবে আপডেট হয়েছে।");

      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        "তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-lg py-6 sm:py-10">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          তথ্য আপডেট করুন
        </h1>

        <p className="mt-2 text-xs leading-5 text-muted sm:text-sm">
          আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন।
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-line bg-surface p-5 shadow-sm sm:p-6"
      >
        <div>
          <label
            htmlFor="update-name"
            className="mb-2 block text-xs font-semibold text-ink"
          >
            নাম
          </label>

          <input
            id="update-name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="আপনার নাম লিখুন"
            className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-bazar-green focus:ring-2 focus:ring-green-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex min-h-11 w-full items-center justify-center rounded-lg bg-bazar-green px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-bazar-green-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
        </button>

        <Link
          href="/profile"
          className="mt-4 flex min-h-10 items-center justify-center rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-alt"
        >
          ফিরে যান
        </Link>
      </form>
    </section>
  );
}