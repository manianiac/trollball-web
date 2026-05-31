import fs from "fs";
import path from "path";

import React, { useState } from "react";
import Link from "next/link";

import { TeamIcon } from "../../components/icons";
import { STATIC_LEAGUE_SCHEDULE } from "@/shared/schedule";
import DefaultLayout from "../../layouts/default";
import { match } from "@/shared/types";

interface SchedulePageProps {
  games: match[];
}

export const getStaticProps = async () => {
  // Try to locate the runner/results directory
  const potentialPaths = [
    path.join(process.cwd(), "..", "runner", "results"),
    path.join(process.cwd(), "runner", "results"),
    path.join(process.cwd(), "utils", "gameRunner", "results"),
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
  };
};

export default function SchedulePage({ games }: SchedulePageProps) {
  // Group matches by week number
  const gamesByWeek = React.useMemo(() => {
    interface GamesByWeek {
      [week: number]: typeof STATIC_LEAGUE_SCHEDULE;
    }

    return STATIC_LEAGUE_SCHEDULE.reduce((acc, match) => {
      const week = match.week;

      if (!acc[week]) {
        acc[week] = [];
      }
      acc[week].push(match);

      return acc;
    }, {} as GamesByWeek);
  }, []);

  const allWeekNums = React.useMemo(() => {
    return Object.keys(gamesByWeek)
      .map(Number)
      .sort((a, b) => a - b);
  }, [gamesByWeek]);

  // Determine the latest completed week by checking the loaded games data.
  const latestCompletedWeek = React.useMemo(() => {
    return games.length > 0 ? Math.max(...games.map((g) => g.week)) : -1;
  }, [games]);

  // Set selected week to the first incomplete week, or week 0 if none simulated yet, or the last week if all completed.
  const [selectedWeek, setSelectedWeek] = useState<number>(() => {
    if (games.length === 0) return 0;
    const nextWeek = latestCompletedWeek + 1;
    const maxWeek = allWeekNums.length - 1;
    return nextWeek <= maxWeek ? nextWeek : maxWeek;
  });

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-6 p-4 md:p-8 w-full">
        {/* Hero Header */}
        <div className="w-full max-w-4xl text-center py-8 px-6 rounded-3xl bg-gradient-to-r from-orange-50/40 via-amber-50/50 to-orange-50/40 dark:from-orange-600/10 dark:via-amber-600/15 dark:to-orange-600/10 border border-orange-200/50 dark:border-orange-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10" />
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans uppercase">
            League Schedule
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto font-medium italic">
            &ldquo;From the first blood of Preseason to the final championship
            whistle.&rdquo;
          </p>
        </div>

        {/* Horizontal Week Selection Bar */}
        <div className="w-full max-w-4xl flex overflow-x-auto gap-3 py-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent justify-start px-4">
          {allWeekNums.map((weekNum) => {
            const isCompleted = weekNum <= latestCompletedWeek;
            const isSelected = selectedWeek === weekNum;
            return (
              <button
                key={weekNum}
                onClick={() => setSelectedWeek(weekNum)}
                className={`cursor-pointer px-4 py-2.5 rounded-xl font-bold font-sans text-xs uppercase transition-all whitespace-nowrap border ${
                  isSelected
                    ? "bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-950/20"
                    : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:border-gray-350 dark:hover:border-gray-850"
                }`}
              >
                Week {weekNum + 1}
                {isCompleted && (
                  <span className="ml-1.5 text-[10px] text-green-600 dark:text-green-400">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Week Title */}
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 border-l-4 border-orange-500 pl-4 pb-1 mt-4 w-full max-w-4xl font-sans flex items-center justify-between">
          <span>Week {selectedWeek + 1} Matches</span>
          {selectedWeek <= latestCompletedWeek ? (
            <span className="text-xs uppercase tracking-wider text-green-700 dark:text-green-400 font-bold bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded border border-green-200 dark:border-green-900/30">
              Completed
            </span>
          ) : (
            <span className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-900/30">
              Upcoming
            </span>
          )}
        </h2>

        {/* Matches List */}
        <div className="flex flex-col gap-4 w-full max-w-4xl mt-2">
          {gamesByWeek[selectedWeek]?.map((scheduledMatch, idx) => {
            const isBye =
              scheduledMatch.homeTeam.slug === "bye" ||
              scheduledMatch.awayTeam.slug === "bye";
            if (isBye) {
              const activeTeam =
                scheduledMatch.homeTeam.slug === "bye"
                  ? scheduledMatch.awayTeam
                  : scheduledMatch.homeTeam;
              return (
                <div
                  key={idx}
                  className="flex flex-row items-center justify-between p-4 md:p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 border border-gray-200 dark:border-gray-900 rounded-2xl relative overflow-hidden transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-850/30 dark:to-gray-800/30" />
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-1.5 md:p-2 rounded-xl border border-gray-200 dark:border-gray-800/80 shrink-0">
                      <TeamIcon size={32} team={activeTeam.name} />
                    </div>
                    <span className="font-bold text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-100 font-sans">
                      {activeTeam.name}
                    </span>
                  </div>
                  <span className="text-[10px] md:text-xs uppercase tracking-widest text-amber-700 dark:text-amber-500/80 font-bold bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/30 px-3 py-1 rounded-full font-sans">
                    BYE WEEK
                  </span>
                </div>
              );
            }

            // Find a played match that matches the schedule home/away in this week
            const playedGame = games.find((g) => {
              const gHome = g.homeTeam as any;
              const gAway = g.awayTeam as any;
              return (
                g.week === scheduledMatch.week &&
                ((gHome.name === scheduledMatch.homeTeam.name &&
                  gAway.name === scheduledMatch.awayTeam.name) ||
                  (gHome.name === scheduledMatch.awayTeam.name &&
                    gAway.name === scheduledMatch.homeTeam.name))
              );
            });

            const isPlayed = !!playedGame;

            const MatchCardContent = (
              <div className="flex flex-row items-center justify-between p-4 md:p-6 gap-2 md:gap-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 border border-gray-200 dark:border-gray-900 rounded-2xl relative overflow-hidden transition-all duration-300">
                {/* Glow accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                    isPlayed
                      ? "from-orange-600/20 to-amber-600/20 group-hover:from-orange-500 group-hover:to-amber-500"
                      : "from-gray-200 to-gray-250 dark:from-gray-800/10 dark:to-gray-800/10"
                  } transition-all duration-300`}
                />

                {/* Home Team */}
                <div className="flex items-center gap-2 md:gap-4 w-5/12 justify-end text-right">
                  <span className="font-bold text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors font-sans truncate">
                    {scheduledMatch.homeTeam.name}
                  </span>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-1.5 md:p-2 rounded-xl border border-gray-200 dark:border-gray-800/80 shrink-0">
                    <TeamIcon size={32} team={scheduledMatch.homeTeam.name} />
                  </div>
                </div>

                {/* Status / Score */}
                <div className="flex flex-col items-center justify-center w-2/12 shrink-0">
                  {isPlayed ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xs md:text-base font-mono font-bold bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 px-2.5 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-400 transition-all duration-300 shadow-sm">
                        {playedGame.homeScore} - {playedGame.awayScore}
                      </span>
                      <span className="text-[8px] md:text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-widest mt-0.5">
                        Report
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-900 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-sans">
                        VS
                      </span>
                      <span className="text-[8px] md:text-[9px] text-amber-600 dark:text-amber-500/80 font-bold uppercase tracking-widest mt-1 md:mt-2">
                        Upcoming
                      </span>
                    </div>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex items-center gap-2 md:gap-4 w-5/12 justify-start text-left">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-1.5 md:p-2 rounded-xl border border-gray-200 dark:border-gray-800/80 shrink-0">
                    <TeamIcon size={32} team={scheduledMatch.awayTeam.name} />
                  </div>
                  <span className="font-bold text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors font-sans truncate">
                    {scheduledMatch.awayTeam.name}
                  </span>
                </div>
              </div>
            );

            return isPlayed ? (
              <Link
                key={idx}
                href={`/games/${playedGame.slug}`}
                className="block group hover:scale-[1.005] transition-all duration-300"
              >
                {MatchCardContent}
              </Link>
            ) : (
              <div key={idx} className="block">
                {MatchCardContent}
              </div>
            );
          })}
        </div>
      </section>
    </DefaultLayout>
  );
}
