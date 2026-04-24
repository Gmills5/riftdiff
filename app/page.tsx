"use client";

import { useState } from "react";

export default function Home() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [player, setPlayer] = useState<any>(null);

  async function searchPlayer() {
    const res = await fetch(
      `/api/riot/account?gameName=${gameName}&tagLine=${tagLine}`
    );

    const account = await res.json();

    const rankRes = await fetch(`/api/riot/rank?puuid=${account.puuid}`);
    const rank = await rankRes.json();

    setPlayer({
      ...account,
      rank: rank,
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

      {player && (
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
  </div>
)}
    </main>
  );
}