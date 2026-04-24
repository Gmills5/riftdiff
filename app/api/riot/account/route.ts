import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiKey = process.env.RIOT_API_KEY;

  const { searchParams } = new URL(request.url);
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: "Missing gameName or tagLine" },
      { status: 400 }
    );
  }

  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;

  const response = await fetch(url, {
    headers: {
      "X-Riot-Token": apiKey!,
    },
  });

  const data = await response.json();

  return NextResponse.json(data);
}