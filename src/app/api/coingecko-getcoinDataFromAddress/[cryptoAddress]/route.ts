import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cryptoAddress: string }> }
) {
  const { cryptoAddress } = await params;

  const url = `https://api.coingecko.com/api/v3/coins/solana/contract/${cryptoAddress}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_DEMO_API_KEY || "",
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch data for ${cryptoAddress}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching CoinGecko data:", error);
    // Check if the error is an instance of `Error` to safely access its properties
    if (error instanceof Error) {
      return NextResponse.json({
        error: "Failed to fetch CoinGecko data",
        details: error.message,
      });
    }

    // Fallback for unexpected error types
    return NextResponse.json({
      error: "Failed to fetch CoinGecko data",
      details: "An unknown error occurred.",
    });
  }
}
