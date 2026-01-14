// app/games/page.tsx

import React from "react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";

import { GAMES } from "@/utils/games.generated"; // Adjust path to your GAMES file
import { match } from "@/utils/types";
import DefaultLayout from "@/layouts/default";

// This is a helper type for our grouped data
interface SeriesData {
  homeTeam: any; // Using any for now to avoid the Partial<Team> issues, improving robustness
  awayTeam: any;
  games: match[];
  homeWins: number;
  awayWins: number;
  isDecided: boolean;
}

export default function GamesPage() {
  // 1. Filter for Playoff Games (Playoff games have slugs starting with 'po-') and Group by Series
  const seriesMap = new Map<string, SeriesData>();

  // Filter ONLY playoff games by slug prefix
  // Note: We check if 'slug' exists just in case, though it should.
  const playoffGames = GAMES.filter(
    (game) => game.slug && game.slug.startsWith("po-"),
  );

  playoffGames.forEach((game) => {
    // Validate teams
    // Explicitly cast to 'any' to check name properties safely
    const home = game.homeTeam as any;
    const away = game.awayTeam as any;

    if (!home.name || !away.name) return;

    // Create a unique key for the matchup (alphabetically sorted to ensure consistency)
    // regardless of who is home/away in a specific game
    const teamNames = [home.name, away.name].sort();
    const seriesKey = teamNames.join(" vs ");

    if (!seriesMap.has(seriesKey)) {
      seriesMap.set(seriesKey, {
        homeTeam: home, // Note: "Home" here is just for display reference
        awayTeam: away,
        games: [],
        homeWins: 0,
        awayWins: 0,
        isDecided: false,
      });
    }

    const series = seriesMap.get(seriesKey)!;
    series.games.push(game);
  });

  // 2. Process each series: sort games, count wins, add dummy game
  const allSeries: SeriesData[] = Array.from(seriesMap.values()).map(
    (series) => {
      // Sort games based on slug number (po-0, po-1, po-2)
      series.games.sort((a, b) => {
        const getNum = (s: string) => {
          const parts = s.split("-");
          if (parts.length >= 2 && parts[0] === "po") {
            return parseInt(parts[1], 10);
          }
          return 0;
        };
        // Sort Ascending (Game 1, Game 2, Game 3)
        return getNum(a.slug) - getNum(b.slug);
      });

      // Determine wins based on scores
      // Note: We need to check who won EACH specific game instance
      let team1Wins = 0; // Wins for the team stored as series.homeTeam
      let team2Wins = 0; // Wins for the team stored as series.awayTeam

      const seriesHomeName = series.homeTeam.name;

      series.games.forEach((g) => {
        const gHome = g.homeTeam as any;
        const gAway = g.awayTeam as any;

        const gHomeName = gHome.name;
        const gAwayName = gAway.name;

        // Verify who is who in this specific game record
        let gameHomeScore = g.homeScore;
        let gameAwayScore = g.awayScore;

        // Identify winner of this game
        let winnerName = "";
        if (gameHomeScore > gameAwayScore) winnerName = gHomeName;
        else if (gameAwayScore > gameHomeScore) winnerName = gAwayName;

        if (winnerName === seriesHomeName) {
          team1Wins++;
        } else if (winnerName) {
          // If not the series 'home' team, must be the other one
          team2Wins++;
        }
      });

      series.homeWins = team1Wins;
      series.awayWins = team2Wins;

      // Best of 3 Logic
      if (team1Wins >= 2 || team2Wins >= 2) {
        series.isDecided = true;
      }

      return series;
    },
  );

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-4 p-4">
        <h1 className="text-3xl font-bold">Playoff Series (Best of 3)</h1>

        <div className="flex flex-col gap-8 w-full max-w-4xl">
          {allSeries.map((series) => {
            const { homeTeam, awayTeam, games } = series;

            // We always want to show 3 games
            // Index 0 -> Game 1
            // Index 1 -> Game 2
            // Index 2 -> Game 3
            const seriesGames = [0, 1, 2].map((i) => {
              // Find the game corresponding to this index (by slug 'po-i')
              return games.find((g) => {
                const parts = g.slug.split("-");
                if (parts.length >= 2 && parts[0] === "po") {
                  return parseInt(parts[1], 10) === i;
                }
                return false; // Fallback
              });
            });

            return (
              <Card key={homeTeam.name + awayTeam.name} className="p-4">
                <CardBody>
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold">{homeTeam.name}</span>
                      <span className="text-sm text-default-400">
                        Wins Hidden
                      </span>
                    </div>
                    <span className="text-default-500 font-bold">VS</span>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold">{awayTeam.name}</span>
                      <span className="text-sm text-default-400">
                        Wins Hidden
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {seriesGames.map((game, index) => {
                      const gameNum = index + 1;

                      if (game) {
                        // REAL GAME
                        const gHome = game.homeTeam as any;
                        const gAway = game.awayTeam as any;
                        return (
                          <Link
                            key={game.slug}
                            className="block p-4 rounded-lg bg-default-50 hover:bg-default-100 transition-colors border border-default-200"
                            href={`/games/${game.slug}`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-primary">
                                Game {gameNum}
                              </span>
                              <div className="text-sm">
                                {gHome.name} vs {gAway.name}
                              </div>
                            </div>
                          </Link>
                        );
                      } else {
                        // DUMMY GAME (Unplayed / Game 3 not needed)
                        return (
                          <Link
                            key={`dummy-${index}`}
                            className="block p-4 rounded-lg bg-default-50 border border-default-200 hover:bg-default-100 transition-colors"
                            href="/games/unplayed"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-primary">
                                Game {gameNum}
                              </span>
                              <div className="text-sm">
                                {homeTeam.name} vs {awayTeam.name}
                              </div>
                            </div>
                          </Link>
                        );
                      }
                    })}
                  </div>
                </CardBody>
              </Card>
            );
          })}

          {allSeries.length === 0 && (
            <div className="text-center text-default-500">
              No playoff series found. check back later!
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
