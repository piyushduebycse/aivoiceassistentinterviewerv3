import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // Allow all origins for testing — change "*" to specific origin for production
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, x-vercel-protection-bypass")

    return response
}

// Apply middleware only to API routes
export const config = {
    matcher: '/api/:path*',
}
