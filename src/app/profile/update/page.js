import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import AuthShell from "../../components/AuthShell";
import UpdateProfileForm from "../../components/UpdateProfileForm";

function UpdateProfileLoading() {
  return (
    <div className="bazar-container py-10 text-center">
      <p className="text-sm text-muted">
        তথ্য লোড হচ্ছে...
      </p>
    </div>
  );
}

async function UpdateProfileContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <AuthShell activePage="profile">
      <UpdateProfileForm
        initialName={session.user.name || ""}
      />
    </AuthShell>
  );
}

export default function UpdateProfilePage() {
  return (
    <Suspense fallback={<UpdateProfileLoading />}>
      <UpdateProfileContent />
    </Suspense>
  );
}