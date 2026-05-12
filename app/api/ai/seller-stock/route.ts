import { NextResponse } from "next/server";
import { sellerAgent } from "@/lib/ai/sellerAgent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await sellerAgent(body.message);

    return NextResponse.json({
      success: true,
      stock: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Seller stock agent failed",
        error: String(error),
      },
      { status: 400 }
    );
  }
}