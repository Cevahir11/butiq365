import { NextResponse } from "next/server";
import { insightAgent } from "@/lib/ai/insightAgent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await insightAgent(body);

    return NextResponse.json({
      success: true,
      insight: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Seller insight agent failed",
        error: String(error),
      },
      { status: 400 }
    );
  }
}