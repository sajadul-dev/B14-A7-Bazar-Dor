import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      const signInUrl = new URL("/signin", request.url);

      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error(
      "Protected route authentication failed:",
      error
    );

    const signInUrl = new URL("/signin", request.url);

    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    "/product/:path*",
    "/profile",
    "/profile/:path*",
  ],
};