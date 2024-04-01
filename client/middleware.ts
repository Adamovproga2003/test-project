import { NextResponse, NextRequest } from "next/server";
import { AUTH_CONSTANTS } from "./constants/auth.constants";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  let isAuthenticated = !!token;

  if (token) {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + AUTH_CONSTANTS.BASE + AUTH_CONSTANTS.ME,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      }
    )
      .then((res) => res.json())
      .catch((err) => console.error(err));
    if (!res || res.errors || res.error) {
      isAuthenticated = false;
    }
  }

  if (isAuthenticated) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}

export const config = {
  matcher: ["/edit/:articleID*", "/create"],
};
