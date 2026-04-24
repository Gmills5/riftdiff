"use client";

import { useState } from "react";

export default function Home() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [player, setPlayer] = useState<any>(null);

  async function searchPlayer() {
    setPlayer(null);

    const res = await fetch(
      `/api/riot/account?gameName=${encodeURIComponent(
        gameName
      )}&tagLine=${encodeURIComponent(tagLine)}`
    );

    if (!res.ok) {
      setPlayer({ error: "Could not find player or Riot API timed out." });
      return;
    }

    const account = await res.json();

    const rankRes = await fetch(
      `/api/riot/rank?puuid=${encodeURIComponent(account.puuid)}`
    );

    const rank = rankRes.ok ? await rankRes.json() : [];

    const matchRes = await fetch(
      `/api/riot/matches?puuid=${encodeURIComponent(account.puuid)}`
    );

    const matches = matchRes.ok ? await matchRes.json() : [];

    setPlayer({
      ...account,
      rank,
      matches,
    });
  }

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-6">RiftDiff</h1>

      <div className="flex gap-3 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Game Name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Tag Line"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
        />

        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={searchPlayer}
        >
          Search
        </button>
      </div>

      {player?.error && (
        <p className="text-red-600 mb-4">{player.error}</p>
      )}

      {player && !player.error && (
        <div className="bg-gray-100 p-4 rounded">
          <p>
            <strong>Name:</strong> {player.gameName}#{player.tagLine}
          </p>

          {player.rank && player.rank.length > 0 ? (
            <div>
              <p>
                <strong>Rank:</strong> {player.rank[0].tier}{" "}
                {player.rank[0].rank}
              </p>

              <p>
                <strong>LP:</strong> {player.rank[0].leaguePoints}
              </p>

              <p>
                <strong>Wins/Losses:</strong> {player.rank[0].wins}W /{" "}
                {player.rank[0].losses}L
              </p>

              <p>
                <strong>Winrate:</strong>{" "}
                {Math.round(
                  (player.rank[0].wins /
                    (player.rank[0].wins + player.rank[0].losses)) *
                    100
                )}
                %
              </p>
            </div>
          ) : (
            <p>Unranked</p>
          )}

          {player.matches && player.matches.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">Recent Matches</h2>

              {player.matches.map((match: any, index: number) => (
                <div
                  key={index}
                  className={`p-3 mb-2 rounded ${
                    match.win ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <p>
                    <strong>{match.champion}</strong> ({match.lane})
                  </p>

                  <p>
                    {match.kills}/{match.deaths}/{match.assists} KDA
                  </p>

                  <p>{match.win ? "Win" : "Loss"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}