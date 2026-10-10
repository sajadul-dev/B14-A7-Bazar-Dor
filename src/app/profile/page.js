import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import AuthShell from "../components/AuthShell";
import ProfilePanel from "../components/ProfilePanel";

function ProfileLoading() {
  return (
    <div className="bazar-container py-10 text-center">
      <p className="text-sm text-muted">
        প্রোফাইল লোড হচ্ছে...
      </p>
    </div>
  );
}

async function ProfileContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const user = {
    name: session.user.name || "",
    email: session.user.email || "",
  };

  return (
    <AuthShell activePage="profile">
      <ProfilePanel user={user} />
    </AuthShell>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  );
}