import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";

import { TeamIcon } from "@/components/icons"; // Adjust path to your TeamIcon
import { TEAMS } from "@/utils/teams";
import { Divider } from "@heroui/divider";
import { Accordion, AccordionItem } from "@heroui/accordion";
import ReactMarkdown from "react-markdown";

// This page component will receive 'params' from the dynamic route
export default function GamePage({ params }: { params: { game: string } }) {
  // --- Data Fetching (Mockup) ---
  // In a real app, you would use 'params.game' to fetch this data
  // from your API or database.
  // const gameData = await fetchGameData(params.game);

  function formatAnnouncerText(text: string) {
    // 1. Clean up outer quotes (if they exist from the mock data)
    const cleanText = text.replace(/^"|"$/g, "");

    return cleanText.replaceAll("\n\n", "\n\n&nbsp;\n\n");
  }

  const mockGameData = {
    homeTeam: TEAMS["The New Ravenfall Commanders"],
    awayTeam: TEAMS["The New Monteforte Chaos Creatures"],
    preGame:
      '"Hello again, all you delightful degenerates! This is Nok the Corrupter, your one and only fiend-on-the-field, broadcasting live from the magnificent **Stronghold Bailey** here in New Ravenfall!\n\nAnd what a venue it is, folks! We are packed into the central bailey of Stronghold Castle itself, with fans hanging from the ramparts and a beautiful pitch of packed earth and cobblestone. Oh, I bet old Sir Tanos is just *fuming* that we’re having this much fun in his big, serious fortress. It’s beautiful!\n\nToday, we have a glorious matchup for you! Your very own **New Ravenfall Commanders** are taking the home field, and they look ready. I saw their healer, Hooge Imtiaz, leading them in one of those synchronized chants that just gets louder and louder. It’s giving me chills!\n\nAnd in the away corner, all the way from New Monteforte, it’s **The New Monteforte Chaos Creatures**! And let me tell you, they are living up to the name. Their healer, Lian Denton, was just seen chugging a shot of *hot gravy* from a dented cup. Now *that’s* a pre-game ritual! That’s more spirit than Dame Terra has in her entire library. I also heard Wolbrom Ariella singing a sea shanty, completely out of tune. It’s magnificent!\n\nThe whistle is about to blow, folks. It’s the Commanders vs. the Chaos Creatures, right here in the heart of the castle. This is going to be a glorious, messy, wonderful brawl. Don’t you go anywhere!"',
    postGame:
      "And that’s the game! Hold onto your helmets, folks, because your New Ravenfall Commanders have done it! They’ve defended their home turf and pulled out the win in a nail-biter, **1 to 0** over the New Monteforte Chaos Creatures!\n\nWhat a game! This was a defensive slugfest from the word 'go.' We saw players trading blows all afternoon. Fogel Raynold was out there knocking players down with his Horseman's Pick. And my goodness, what a run from Wolbrom Ariella of the Chaos Creatures in the first half! Ariella just *blew* through the line for a two-zone run, first past Dusa Curson and then Croteau Osmo. It was a spectacular effort, the kind of charge Colm the Warrior *wishes* he could pull off, but the Commanders' defense shut it down before they could score.\n\nIt was zero-zero at the half, and it all came down to one beautiful, shining moment!\n\nIt started in the second half, with the Commanders on the offensive. **Rhett Gavrilla** got the ball in the Home 2-Point zone and launched a perfect pass... right into the hands of **Jessalin Zobias**! Zobias made the catch, advanced a zone, saw the opening, and just *went for it*! Urata Oriana of the Chaos Creatures made a desperate dive for the block, but Zobias was too quick! A beautiful, magnificent score!\n\That was all they needed! The Chaos Creatures fought like mad to the very end—Jozef Pepe was still knocking players out right up to the last whistle—but the Commanders held the line.\n\nA 1-0 victory for the home team! You see that, Sir Artorias? *That’s* how you win a battle—with teamwork, grit, and a perfectly thrown troll head.\n\nWhat a day for Trollball! This has been Nok the Corrupter, signing off live from the Stronghold Bailey. Now, go cause some trouble!\"",
    date: "Week 0",
  };

  mockGameData.homeTeam.score = 0;
  mockGameData.awayTeam.score = 1;

  const [isScoreVisible, setIsScoreVisible] = useState(false);

  const { homeTeam, awayTeam, preGame, postGame, date } = mockGameData;
  // Helper to determine winner for styling
  const homeWon = homeTeam.score > awayTeam.score;
  const awayWon = awayTeam.score > homeTeam.score;

  return (
    <section className="flex flex-col items-center gap-4 p-4">
      {/* Section 1: Score Result */}
      <Card className="w-full max-w-4xl">
        <CardBody>
          {isScoreVisible ? (
            // IF TRUE: Show the scores
            <div className="flex justify-around items-center text-center p-4">
              {/* Away Team */}
              <div className="flex flex-col items-center gap-2 w-1/3">
                <TeamIcon size={80} team={awayTeam.name} />
                <h2 className="text-xl md:text-2xl font-bold">
                  {awayTeam.name}
                </h2>
                <span
                  className={`text-4xl font-bold ${
                    !awayWon && "text-default-500"
                  }`}
                >
                  {awayTeam.score}
                </span>
              </div>

              {/* Home Team */}
              <div className="flex flex-col items-center gap-2 w-1/3">
                <TeamIcon size={80} team={homeTeam.name} />
                <h2 className="text-xl md:text-2xl font-bold">
                  {homeTeam.name}
                </h2>
                <span
                  className={`text-4xl font-bold ${
                    !homeWon && "text-default-500"
                  }`}
                >
                  {homeTeam.score}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center p-4 min-h-[200px] gap-4">
              <div className="flex justify-around items-center text-center p-4 w-full">
                {/* Away Team */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                  <TeamIcon size={80} team={awayTeam.name} />
                  <h2 className="text-xl md:text-2xl font-bold">
                    {awayTeam.name}
                  </h2>
                </div>
                {/* Home Team */}
                <div className="flex flex-col items-center gap-2 w-1/3">
                  <TeamIcon size={80} team={homeTeam.name} />
                  <h2 className="text-xl md:text-2xl font-bold">
                    {homeTeam.name}
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
          {date} at {homeTeam.stadium.name}
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
                <ReactMarkdown>
                  {formatAnnouncerText(preGame)}
                </ReactMarkdown>{" "}
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
                  {isScoreVisible
                    ? formatAnnouncerText(postGame)
                    : "RESULTS HIDDEN"}
                </ReactMarkdown>{" "}
              </div>
            </CardBody>
          </Card>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
