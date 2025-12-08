import React, { useState } from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Accordion, AccordionItem } from "@heroui/accordion";
import ReactMarkdown from "react-markdown";

import { GAMES } from "@/utils/gameRunner/utils/games.generated";
import { TeamIcon } from "@/components/icons"; // Adjust path to your TeamIcon
import { match } from "@/utils/types";
import DefaultLayout from "@/layouts/default";
import { formatText } from "@/utils/utils";

export async function getStaticPaths() {
  // Loop over your GAMES array to create the slugs
  const paths = GAMES.map((game) => ({
    params: {
      game: `${game.homeTeam.slug}-${game.awayTeam.slug}-${game.week}`,
    },
  }));

  return {
    paths,
    fallback: false, // This means any slug not listed here will 404
  };
}
export async function getStaticProps({ params }: { params: { game: string } }) {
  // --- Find the Game ---
  // params.game is the "slug" from the URL, like "team-a-slug-vs-team-b-slug"
  const gameSlug = params.game;

  const gameData = GAMES.find((g) => g.slug === gameSlug);

  // If no game matches the slug, show a 404 page
  if (!gameData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      gameData,
    },
  };
}
// This page component will receive 'params' from the dynamic route
export default function GamePage({ gameData }: { gameData: match }) {
  const [isScoreVisible, setIsScoreVisible] = useState(false);

  const {
    homeTeam,
    awayTeam,
    preGame,
    postGame,
    week: date,
    homeScore,
    awayScore,
  } = gameData;
  // Helper to determine winner for styling
  const homeWon = homeScore > awayScore;
  const awayWon = awayScore > homeScore;

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-4 p-4">
        {/* Section 1: Score Result */}
        <Card className="w-full max-w-4xl">
          <CardBody>
            {isScoreVisible ? (
              // IF TRUE: Show the scores
              <div className="flex justify-around items-center text-center p-4">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                  <TeamIcon size={80} team={homeTeam.name} />
                  <h2 className="text-xl md:text-2xl font-bold">
                    {homeTeam.name}
                  </h2>
                  <span
                    className={`text-4xl font-bold ${!homeWon && "text-default-500"
                      }`}
                  >
                    {homeScore}
                  </span>
                </div>
                {/* Away Team */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                  <TeamIcon size={80} team={awayTeam.name} />
                  <h2 className="text-xl md:text-2xl font-bold">
                    {awayTeam.name}
                  </h2>
                  <span
                    className={`text-4xl font-bold ${!awayWon && "text-default-500"
                      }`}
                  >
                    {awayScore}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center p-4 min-h-[200px] gap-4">
                <div className="flex justify-around items-center text-center p-4 w-full">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-2 w-1/3">
                    <TeamIcon size={80} team={homeTeam.name} />
                    <h2 className="text-xl md:text-2xl font-bold">
                      {homeTeam.name}
                    </h2>
                  </div>
                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-2 w-1/3">
                    <TeamIcon size={80} team={awayTeam.name} />
                    <h2 className="text-xl md:text-2xl font-bold">
                      {awayTeam.name}
                    </h2>
                  </div>
                </div>
                <div>
                  <button
                    className="cursor-pointer rounded bg-gray-700 px-4 py-2 font-bold text-white hover:bg-gray-600 text-lg"
                    onClick={() => setIsScoreVisible(true)}
                  >
                    Click to Reveal Final Score
                  </button>
                </div>
              </div>
            )}
          </CardBody>
          <Divider />
          <CardFooter className="flex justify-center text-small text-default-500">
            Week {date} at {homeTeam.stadium.name}
          </CardFooter>
        </Card>
        {/* Sections 2 & 3: Pregame / Postgame */}
        <Accordion>
          {/* Pregame Summary */}
          <AccordionItem
            key="1"
            aria-label="Pregame Summary"
            title="Pregame Summary"
          >
            <Card>
              <CardBody>
                <div className="prose text-default-700">
                  <ReactMarkdown>{formatText(preGame)}</ReactMarkdown>{" "}
                </div>
              </CardBody>
            </Card>
          </AccordionItem>
          {/* Postgame Wrapup */}
          <AccordionItem
            key="2"
            aria-label="Postgame Wrapup"
            title="Postgame Wrapup"
          >
            <Card>
              <CardBody>
                <div className="prose text-default-700">
                  <ReactMarkdown>
                    {isScoreVisible ? formatText(postGame) : "RESULTS HIDDEN"}
                  </ReactMarkdown>{" "}
                </div>
              </CardBody>
            </Card>
          </AccordionItem>
        </Accordion>
      </section>
    </DefaultLayout>
  );
}
