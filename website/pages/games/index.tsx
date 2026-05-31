import React, { useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import path from "path";
import fs from "fs";

import { match } from "@/shared/types";
import DefaultLayout from "../../layouts/default";
import { TeamIcon } from "../../components/icons";

// Helper type for grouped data
interface SeriesData {
  homeTeam: any;
  awayTeam: any;
  games: match[];
  homeWins: number;
  awayWins: number;
  isDecided: boolean;
}

interface GamesPageProps {
  games: match[];
}

export const getStaticProps = async () => {
  // Try to locate the runner/results directory
  // Assuming strict separation: website/ is cwd for Next.js, runner/ is sibling.
  // We check a few locations for robustness.
  const potentialPaths = [
    path.join(process.cwd(), "..", "runner", "results"), // if cwd is website/
    path.join(process.cwd(), "runner", "results"), // if cwd is root
    path.join(process.cwd(), "utils", "gameRunner", "results"), // legacy fallback
  ];

  let resultsDir = "";
  for (const p of potentialPaths) {
    if (fs.existsSync(p)) {
      resultsDir = p;
      break;
    }
  }

  const games: match[] = [];

  if (resultsDir) {
    const files = fs.readdirSync(resultsDir);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const filePath = path.join(resultsDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const gameData = JSON.parse(fileContent);
        games.push(gameData);
      } catch (err) {
        console.warn(`Error parsing game file ${file}:`, err);
      }
    }
  }

  return {
    props: {
      games,
    },
    // Revalidate every 10 seconds to pick up new games in dev mode (incremental static regeneration equivalent)
    // or just static build. For dev, Next.js calls this on every request.
  };
};

export default function GamesPage({ games }: GamesPageProps) {
  // Determine if we have playoff games vs regular season games.
  // If playoffs have started (any po- slugs exist), display playoffs, otherwise regular season.
  const hasPlayoffs = games.some((g) => g.slug && g.slug.startsWith("po-"));
  const view = hasPlayoffs ? "playoffs" : "regular";

  // --- PLAYOFF LOGIC ---
  const seriesMap = new Map<string, SeriesData>();
  const playoffGames = games.filter(
    (game) => game.slug && game.slug.startsWith("po-"),
  );

  playoffGames.forEach((game) => {
    const home = game.homeTeam as any;
    const away = game.awayTeam as any;
    if (!home.name || !away.name) return;

    const teamNames = [home.name, away.name].sort();
    const seriesKey = teamNames.join(" vs ");

    if (!seriesMap.has(seriesKey)) {
      seriesMap.set(seriesKey, {
        homeTeam: home,
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

  const allSeries: SeriesData[] = Array.from(seriesMap.values()).map(
    (series) => {
      series.games.sort((a, b) => a.week - b.week);
      let team1Wins = 0;
      let team2Wins = 0;
      const seriesHomeName = series.homeTeam.name;

      series.games.forEach((g) => {
        const gHome = g.homeTeam as any;
        const gAway = g.awayTeam as any;
        const gHomeName = gHome.name;
        const gAwayName = gAway.name;

        let gameHomeScore = g.homeScore;
        let gameAwayScore = g.awayScore;

        let winnerName = "";
        if (gameHomeScore > gameAwayScore) winnerName = gHomeName;
        else if (gameAwayScore > gameHomeScore) winnerName = gAwayName;

        if (winnerName === seriesHomeName) {
          team1Wins++;
        } else if (winnerName) {
          team2Wins++;
        }
      });

      series.homeWins = team1Wins;
      series.awayWins = team2Wins;

      if (team1Wins >= 2 || team2Wins >= 2) {
        series.isDecided = true;
      }

      return series;
    },
  );

  const roundsMap = new Map<number, SeriesData[]>();
  allSeries.forEach((series) => {
    if (series.games.length === 0) return;
    const firstSlug = series.games[0]?.slug || "";
    const parts = firstSlug.split("-");
    let roundIndex = 0;
    if (parts.length >= 2 && parts[0] === "po") {
      roundIndex = parseInt(parts[1], 10);
    }

    const isBestOf5 = roundIndex >= 6;
    const winsNeeded = isBestOf5 ? 3 : 2;

    if (series.homeWins >= winsNeeded || series.awayWins >= winsNeeded) {
      series.isDecided = true;
    }

    if (!roundsMap.has(roundIndex)) {
      roundsMap.set(roundIndex, []);
    }
    roundsMap.get(roundIndex)!.push(series);
  });

  const sortedRounds = Array.from(roundsMap.keys()).sort((a, b) => b - a);

  // --- REGULAR SEASON LOGIC ---
  const regularSeasonGames = games.filter(
    (game) => !game.slug || !game.slug.startsWith("po-"),
  );

  const regularGamesByWeek = React.useMemo(() => {
    const acc = new Map<number, match[]>();
    regularSeasonGames.forEach((game) => {
      const week = game.week;
      if (!acc.has(week)) {
        acc.set(week, []);
      }
      acc.get(week)!.push(game);
    });
    return acc;
  }, [regularSeasonGames]);

  const sortedWeeks = React.useMemo(() => {
    return Array.from(regularGamesByWeek.keys()).sort((a, b) => b - a);
  }, [regularGamesByWeek]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-6 p-4 md:p-8 w-full">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
          Match Reports
        </h1>

        <div className="flex flex-col gap-12 w-full max-w-4xl">
          {view === "regular" && (
            <div className="flex flex-col gap-10">
              {sortedWeeks.map((weekNum) => {
                const weekGames = regularGamesByWeek.get(weekNum)!;
                return (
                  <div key={weekNum} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 border-l-4 border-orange-500 pl-4 pb-1 flex items-center justify-between font-sans">
                      <span>Week {weekNum + 1}</span>
                      <span className="text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded border border-orange-200/30 dark:border-orange-900/30">
                        {weekGames.length} Matches
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 gap-4 mt-2">
                      {weekGames.map((game) => {
                        const home = game.homeTeam as any;
                        const away = game.awayTeam as any;
                        return (
                          <Link
                            key={game.slug}
                            href={`/games/${game.slug}`}
                            className="block group"
                          >
                            <Card className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-900 hover:border-orange-500/30 transition-all duration-300 shadow-lg hover:scale-[1.005]">
                              <CardBody className="p-5 flex flex-row items-center justify-between">
                                {/* Home Team */}
                                <div className="flex items-center gap-4 w-5/12">
                                  <div className="bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800">
                                    <TeamIcon size={36} team={home.name} />
                                  </div>
                                  <span className="font-bold text-sm md:text-base text-gray-800 dark:text-gray-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors truncate font-sans">
                                    {home.name}
                                  </span>
                                </div>
                                {/* Score */}
                                <div className="flex flex-col items-center justify-center w-2/12">
                                  <span className="text-base md:text-lg font-bold bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 px-4 py-1.5 rounded-xl text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-400 transition-all duration-300 font-mono shadow-sm">
                                    {game.homeScore} - {game.awayScore}
                                  </span>
                                </div>
                                {/* Away Team */}
                                <div className="flex items-center justify-end gap-4 w-5/12 text-right">
                                  <span className="font-bold text-sm md:text-base text-gray-800 dark:text-gray-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors truncate font-sans">
                                    {away.name}
                                  </span>
                                  <div className="bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800">
                                    <TeamIcon size={36} team={away.name} />
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {sortedWeeks.length === 0 && (
                <div className="text-center text-default-500 py-10">
                  No regular season games simulated yet. Check back later!
                </div>
              )}
            </div>
          )}

          {view === "playoffs" && (
            <div className="flex flex-col gap-10">
              {sortedRounds.map((roundIndex) => {
                const isBestOf5 = roundIndex >= 6;
                const maxGames = isBestOf5 ? 5 : 3;
                const seriesLabel = isBestOf5 ? "Best of 5" : "Best of 3";

                return (
                  <div key={roundIndex} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 border-b border-default-200 pb-2">
                      Playoff Round {roundIndex + 1}{" "}
                      <span className="text-sm text-default-400 font-normal ml-2">
                        ({seriesLabel})
                      </span>
                    </h2>

                    <div className="flex flex-col gap-8">
                      {roundsMap.get(roundIndex)!.map((series) => {
                        const { homeTeam, awayTeam, games } = series;
                        const firstWeek =
                          games.length > 0
                            ? Math.min(...games.map((g) => g.week))
                            : 1;

                        const seriesGames = Array.from(
                          { length: maxGames },
                          (_, i) => {
                            return games.find((g) => g.week === firstWeek + i);
                          },
                        );

                        return (
                          <Card
                            key={homeTeam.name + awayTeam.name}
                            className="p-4 border border-default-200 shadow-sm"
                          >
                            <CardBody className="p-2">
                              <div className="flex justify-between items-center mb-4 border-b border-default-100 pb-2">
                                <div className="flex flex-col items-center">
                                  <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                    {homeTeam.name}
                                  </span>
                                  <span className="text-xs text-default-400">
                                    {series.homeWins} Wins
                                  </span>
                                </div>
                                <span className="text-default-400 font-bold text-sm">
                                  VS
                                </span>
                                <div className="flex flex-col items-center">
                                  <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                    {awayTeam.name}
                                  </span>
                                  <span className="text-xs text-default-400">
                                    {series.awayWins} Wins
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-3">
                                {seriesGames.map((game, index) => {
                                  const gameNum = index + 1;

                                  if (game) {
                                    const gHome = game.homeTeam as any;
                                    const gAway = game.awayTeam as any;
                                    return (
                                      <Link
                                        key={game.slug}
                                        className="block p-3 rounded-lg bg-default-50 hover:bg-default-100/80 transition-colors border border-default-200/60"
                                        href={`/games/${game.slug}`}
                                      >
                                        <div className="flex justify-between items-center text-xs">
                                          <span className="font-semibold text-primary">
                                            Game {gameNum}
                                          </span>
                                          <div className="text-gray-600 dark:text-gray-300">
                                            {gHome.name} vs {gAway.name} (
                                            {game.homeScore} - {game.awayScore})
                                          </div>
                                        </div>
                                      </Link>
                                    );
                                  } else {
                                    return (
                                      <Link
                                        key={`dummy-${index}`}
                                        className="block p-3 rounded-lg bg-default-50 hover:bg-default-100/80 transition-colors border border-default-200/60"
                                        href="/games/unplayed"
                                      >
                                        <div className="flex justify-between items-center text-xs">
                                          <span className="font-semibold text-primary">
                                            Game {gameNum}
                                          </span>
                                          <div className="text-default-400 italic">
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
                    </div>
                  </div>
                );
              })}

              {sortedRounds.length === 0 && (
                <div className="text-center text-default-500">
                  No playoff series found. Check back later!
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
