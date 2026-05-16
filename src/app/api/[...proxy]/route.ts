import { NextRequest, NextResponse } from "next/server";

type ProxyParams = { params: Promise<{ proxy: string[] }> };

export async function GET(request: NextRequest, { params }: ProxyParams) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.proxy);
}

export async function POST(request: NextRequest, { params }: ProxyParams) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.proxy);
}

export async function PUT(request: NextRequest, { params }: ProxyParams) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.proxy);
}

export async function PATCH(request: NextRequest, { params }: ProxyParams) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.proxy);
}

export async function DELETE(request: NextRequest, { params }: ProxyParams) {
  const resolvedParams = await params;
  return handleProxyRequest(request, resolvedParams.proxy);
}

async function handleProxyRequest(request: NextRequest, proxyPathParams: string[]) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL || "http://localhost:5000";
  
  // The catch-all is at /api/[...proxy], so proxyPathParams = ["auth", "sign-in", "email"]
  // We need to prepend /api/ because the backend expects /api/auth/sign-in/email
  const path = proxyPathParams ? `/api/${proxyPathParams.join("/")}` : "";
  
  // Get search params
  const searchParams = request.nextUrl.searchParams.toString();
  const queryString = searchParams ? `?${searchParams}` : "";

  // Target URL
  const targetUrl = `${backendUrl}${path}${queryString}`;

  try {
    // Clone headers, but remove host/connection to avoid routing issues
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("connection");

    const host = request.headers.get("host");
    if (host) {
      headers.set("x-forwarded-host", host);
      headers.set(
        "x-forwarded-proto",
        request.nextUrl.protocol.replace(":", "") || "https"
      );
    }

    // Extract body if it's not a GET or HEAD request
    let body = null;
    if (request.method !== "GET" && request.method !== "HEAD") {
      try {
        body = await request.text();
      } catch (e) {
        body = null;
      }
    }

    // Perform the proxy fetch
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body || undefined,
      redirect: "manual",
    });

    // 304 has no body — NextResponse rejects invalid status when body is present
    if (response.status === 304) {
      const notModified = new NextResponse(null, { status: 304 });
      response.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey === "set-cookie" || lowerKey === "content-encoding") return;
        notModified.headers.set(key, value);
      });
      return notModified;
    }

    const responseBody = await response.text();
    const proxyResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy over headers from the backend response
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      // Don't forward content-encoding to let Next.js handle it
      if (lowerKey === "content-encoding") return;
      // Don't forward transfer-encoding
      if (lowerKey === "transfer-encoding") return;
      // Skip set-cookie in the loop, handle separately
      if (lowerKey === "set-cookie") return;
      
      proxyResponse.headers.set(key, value);
    });

    // Handle Set-Cookie correctly using getSetCookie() to avoid string concatenation
    const setCookies = response.headers.getSetCookie();
    for (const cookie of setCookies) {
      let rewritten = cookie.replace(/;\s*domain=[^;]*/gi, "");
      rewritten = rewritten.replace(/;\s*samesite=none/gi, "; SameSite=Lax");
      proxyResponse.headers.append("Set-Cookie", rewritten);
    }

    return proxyResponse;
  } catch (error: any) {
    console.error("Proxy Error:", error.message, "URL:", targetUrl);
    return NextResponse.json(
      { error: "Internal Server Error during Proxy", message: error.message },
      { status: 500 }
    );
  }
}
