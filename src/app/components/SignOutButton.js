"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function SignOutButton({
  className = "",
  label = "সাইন আউট",
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    if (loading) return;

    setLoading(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(
          result.error.message || "সাইন আউট করা যায়নি।"
        );
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে।");

      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign-out error:", error);

      toast.error(
        "সাইন আউট করা যায়নি। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading ? "অপেক্ষা করুন..." : label}
    </button>
  );
}