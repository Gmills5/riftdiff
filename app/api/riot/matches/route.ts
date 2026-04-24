import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiKey = process.env.RIOT_API_KEY;

  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get("puuid");

  if (!puuid) {
    return NextResponse.json({ error: "Missing puuid" }, { status: 400 });
  }

  const matchIdsRes = await fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(
      puuid
    )}/ids?start=0&count=10`,
    {
      headers: {
        "X-Riot-Token": apiKey!,
      },
    }
  );

  const matchIds = await matchIdsRes.json();

  if (!matchIdsRes.ok) {
    return NextResponse.json({
      error: "Failed to get match ids",
      data: matchIds,
    });
  }

  const matches = await Promise.all(
    matchIds.map(async (matchId: string) => {
      const matchRes = await fetch(
        `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`,
        {
          headers: {
            "X-Riot-Token": apiKey!,
          },
        }
      );

      const match = await matchRes.json();

      const currentPlayer = match.info.participants.find(
        (participant: any) => participant.puuid === puuid
      );

      if (!currentPlayer) {
        return null;
      }

      return {
        matchId,
        champion: currentPlayer.championName,
        kills: currentPlayer.kills,
        deaths: currentPlayer.deaths,
        assists: currentPlayer.assists,
        win: currentPlayer.win,
        lane: currentPlayer.teamPosition || "UNKNOWN",
        gameMode: match.info.gameMode,
      };
    })
  );

  return NextResponse.json(matches.filter(Boolean));
}