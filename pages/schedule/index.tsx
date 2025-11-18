import React from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Card, CardBody } from "@heroui/card";

import { GAMES } from "../../utils/gameRunner/utils/games.generated"; // Import the completed match results

import { TeamIcon } from "@/components/icons"; // Adjust path as needed
import { LEAGUE_SCHEDULE } from "@/utils/gameRunner/roundRobin"; // Import the static schedule
import DefaultLayout from "@/layouts/default";

// --- CONFIGURATION CONSTANTS ---
// Set the total number of weeks in the regular season.
const SEASON_WEEKS = 8;
// Determine the latest completed week by checking the generated games data.
const LATEST_COMPLETED_WEEK =
  GAMES.length > 0 ? Math.max(...GAMES.map((g) => g.week)) : 0;

// This is a helper type for our grouped data, referencing the BaseMatch interface
interface GamesByWeek {
  [week: number]: typeof LEAGUE_SCHEDULE;
}

export default function SchedulePage() {
  // 1. Group matches by week number
  const gamesByWeek = React.useMemo(() => {
    return LEAGUE_SCHEDULE.reduce((acc, match) => {
      const week = match.week;

      if (!acc[week]) {
        acc[week] = [];
      }
      acc[week].push(match);

      return acc;
    }, {} as GamesByWeek);
  }, []);

  // 2. Get, filter, and sort the week keys
  const visibleWeekKeys = React.useMemo(() => {
    return (
      Object.keys(gamesByWeek)
        .map(Number)
        .filter((weekNum) => weekNum <= SEASON_WEEKS)
        // --- CHANGE: Only show current week (LATEST_COMPLETED_WEEK) and future weeks ---
        .filter((weekNum) => weekNum > LATEST_COMPLETED_WEEK)
        // -------------------------------------------------------------------------------
        .sort((a, b) => a - b)
    ); // Sort ascending (Week 0, 1, 2, 3...)
  }, [gamesByWeek]);

  // Determine the default expanded key (Current Week, if possible)
  const defaultExpandedKey = visibleWeekKeys.includes(LATEST_COMPLETED_WEEK)
    ? LATEST_COMPLETED_WEEK.toString()
    : visibleWeekKeys[0]?.toString();

  // Helper to determine game status
  const getWeekStatus = (weekNum: number) => {
    if (weekNum > LATEST_COMPLETED_WEEK) {
      return { label: "(Upcoming)", color: "text-warning-500" };
    }

    // Note: Past weeks are filtered out in visibleWeekKeys, so this case shouldn't trigger.
    return { label: "", color: "" };
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-6 p-4 md:p-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Trollball Season Schedule
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Viewing upcoming action for the {SEASON_WEEKS} Week Season.
          </p>
        </div>

        <Accordion
          // Automatically expand the current week
          defaultExpandedKeys={[defaultExpandedKey]}
          className="w-full max-w-4xl mt-4"
        >
          {visibleWeekKeys.map((weekNum) => {
            const status = getWeekStatus(weekNum);
            const isFutureWeek = weekNum > LATEST_COMPLETED_WEEK;

            return (
              <AccordionItem
                key={weekNum}
                aria-label={`Games for Week ${weekNum}`}
                title={
                  <span className="text-xl font-semibold">
                    Week {weekNum}
                    <span
                      className={`ml-3 text-sm font-normal ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </span>
                }
              >
                <Card>
                  <CardBody>
                    <div className="flex flex-col gap-3">
                      {gamesByWeek[weekNum].map((match, index) => (
                        // Main Match Container: Stacks vertically on mobile, switches to space-between on medium screens
                        <div
                          key={index}
                          className="flex flex-col md:flex-row md:justify-between md:items-center 
                                     p-3 rounded-lg border border-default-200 dark:border-default-700 
                                     hover:bg-default-100 transition-colors"
                        >
                          {/* Team Info Group: Stacks on mobile */}
                          <div className="flex flex-col items-start gap-1 mb-2 md:flex-row md:items-center md:gap-4 md:mb-0 text-medium font-semibold">
                            {/* Home Team */}
                            <div className="flex items-center gap-2">
                              <TeamIcon team={match.homeTeam.name} size={24} />
                              <span>{match.homeTeam.name}</span>
                            </div>

                            <span className="text-default-500 font-normal ml-8 md:ml-0">
                              vs
                            </span>

                            {/* Away Team */}
                            <div className="flex items-center gap-2">
                              <TeamIcon team={match.awayTeam.name} size={24} />
                              <span>{match.awayTeam.name}</span>
                            </div>
                          </div>

                          {/* Stadium Info: Centered under the teams on mobile, right-aligned on desktop */}
                          <span className="text-sm text-default-600 dark:text-default-400 md:text-right">
                            @ {match.homeTeam.stadium.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>
    </DefaultLayout>
  );
}
