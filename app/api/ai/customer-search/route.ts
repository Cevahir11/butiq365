import { NextResponse } from "next/server";
import { customerAgent } from "@/lib/ai/customerAgent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await customerAgent(body.message);

    return NextResponse.json({
      success: true,
      filters: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Customer search agent failed",
        error: String(error),
      },
      { status: 400 }
    );
  }
}