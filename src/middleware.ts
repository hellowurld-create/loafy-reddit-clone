import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({req})

    if (!token) {
        return NextResponse.redirect(new URL('/log-in', req.nextUrl))
    }
}

export const config = {
    matcher: [
      '/l/:path*/submit', '/l/create'  
    ],
}