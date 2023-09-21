import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/api/chat", "/api/chat-stream"],
};

export function middleware(req: NextRequest, res: NextResponse) {
  return NextResponse.next();
}
