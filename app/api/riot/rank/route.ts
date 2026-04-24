import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiKey = process.env.RIOT_API_KEY;

  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get("puuid");

  if (!puuid) {
  return NextResponse.json({ error: "Missing puuid" }, { status: 400 });
    }

  const summonerRes = await fetch(
    `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
    {
      headers: {
        "X-Riot-Token": apiKey!,
      },
    }
  );

  const summonerData = await summonerRes.json();

  if (!summonerRes.ok) {
    return NextResponse.json({
      step: "summoner lookup failed",
      status: summonerRes.status,
      data: summonerData,
    });
  }

  const rankRes = await fetch(
  `https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
  {
    headers: {
      "X-Riot-Token": apiKey!,
    },
  }
);

  const rankData = await rankRes.json();

  if (!rankRes.ok) {
    return NextResponse.json({
      step: "rank lookup failed",
      status: rankRes.status,
      data: rankData,
    });
  }

  return NextResponse.json(rankData);
}