import React, { useState } from "react";
import { Card, CardBody } from "@heroui/card";

import { GAMES } from "@/utils/games.generated"; // Import the completed match results

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
  const [view, setView] = useState<"regular" | "tournament">("tournament");

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
    return Object.keys(gamesByWeek)
      .map(Number)
      .filter((weekNum) => weekNum <= SEASON_WEEKS)
      .filter((weekNum) => weekNum > LATEST_COMPLETED_WEEK)
      .sort((a, b) => a - b);
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
    return { label: "", color: "" };
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-6 p-4 md:p-8 text-center">
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Trollball Schedule
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Witness the clash of titans in the Post-Season Championship.
          </p>
        </div>

        <div className="w-full max-w-5xl mt-4 flex flex-col gap-4">
          <Card className="p-1 bg-default-50 dark:bg-default-100 border-none shadow-xl">
            <CardBody className="p-0 overflow-hidden rounded-lg">
              <iframe
                src="https://challonge.com/lczzekjm/module?show_standings=1"
                title="Trollball Bracket"
                width="100%"
                height="600"
                className="w-full"
              />
            </CardBody>
          </Card>
          <p className="text-center text-sm text-default-400 italic">
            Live updates via Challonge.com
          </p>
        </div>

        {/* 
          NOTE: Regular Season view is temporarily hidden. 
          To restore, uncomment the ButtonGroup and logic below.
        */}

        {/* 
        <ButtonGroup variant="flat" color="primary">
          <Button onPress={() => setView("regular")}>Regular Season</Button>
          <Button onPress={() => setView("tournament")}>Tournament Bracket</Button>
        </ButtonGroup>
        */}

        {/* 
        {view === "regular" && (
           <Accordion ... />
        )}
        */}
      </section>
    </DefaultLayout>
  );
}
