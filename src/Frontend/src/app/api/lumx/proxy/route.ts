import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_LUMX_API_URL;
  const token = process.env.NEXT_PUBLIC_LUMX_API_TOKEN;
  const body = await req.text();

  const lumxRes = await fetch(url!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
  });

  if (lumxRes.status === 201) {
    const data = await lumxRes.json();
    return NextResponse.json(data, { status: 201 });
  } else {
    const data = await lumxRes.text();
    return new NextResponse(data, {
      status: lumxRes.status,
      headers: { "Content-Type": "application/json" },
    });
  }
}