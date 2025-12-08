// app/games/page.tsx

import React from "react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import { Accordion, AccordionItem } from "@heroui/accordion";

import { GAMES } from "@/utils/gameRunner/utils/games.generated"; // Adjust path to your GAMES file
import { match } from "@/utils/types";
import DefaultLayout from "@/layouts/default";

// This is a helper type for our grouped data
interface GamesByWeek {
  [week: number]: match[]; // Key is week number, value is an array of games
}

export default function GamesPage() {
  // 1. Group games by week
  const gamesByWeek = GAMES.reduce((acc, game) => {
    const week = game.week;

    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(game);

    return acc;
  }, {} as GamesByWeek);

  // 2. Sort the weeks so the highest number (most recent) is first
  const sortedWeekKeys = Object.keys(gamesByWeek)
    .map(Number)
    .sort((a, b) => b - a); // b - a for descending order

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-4 p-4">
        <h1 className="text-3xl font-bold">Weekly Results</h1>
        <Accordion
          className="w-full max-w-4xl"
          defaultExpandedKeys={[sortedWeekKeys[0]?.toString()]} // Automatically expand the latest week
        >
          {sortedWeekKeys.map((weekNum) => (
            <AccordionItem
              key={weekNum}
              aria-label={`Games for Week ${weekNum}`}
              title={
                <span className="text-xl font-semibold">Week {weekNum}</span>
              }
            >
              <Card>
                <CardBody>
                  <div className="flex flex-col gap-3">
                    {/* Now map over the games *for this week* */}
                    {gamesByWeek[weekNum].map((game) => {
                      // Create a unique slug for the game URL
                      return (
                        <Link
                          key={game.slug}
                          className="block p-4 rounded-lg hover:bg-default-100 transition-colors"
                          href={`/games/${game.slug}`}
                        >
                          <div className="flex justify-between items-center">
                            {/* Team Names */}
                            <div>
                              <span className="text-lg">
                                {game.homeTeam.name}
                              </span>
                              <span className="text-lg text-default-600">
                                {" "}
                                vs{" "}
                              </span>
                              <span className="text-lg">
                                {game.awayTeam.name}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </DefaultLayout>
  );
}
