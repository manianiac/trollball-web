import React, { useState } from "react";
import fs from "fs";
import path from "path";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import ReactMarkdown from "react-markdown";

import { TeamIcon } from "../../../components/icons"; // Adjust path to your TeamIcon
import { match, team } from "../../../../shared/types";
import DefaultLayout from "../../../layouts/default";
import { formatText } from "../../../../shared/utils";
import { GAME_MODIFIERS } from "@/simulator/actions/modifiers";

export async function getStaticPaths() {
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

  const paths: { params: { game: string } }[] = [];

  if (resultsDir) {
    const files = fs.readdirSync(resultsDir);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      // Assume file name maps to slug?
      // Actually slug is inside the JSON usually, but file name is likely `week-home-away.json`.
      // Let's read the file to get the slug to be safe, or generate slug from file if needed.
      // In games/index.tsx, we read "slug" property.
      try {
        const filePath = path.join(resultsDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const gameData = JSON.parse(fileContent) as match;
        if (gameData.slug) {
          paths.push({ params: { game: gameData.slug } });
        }
      } catch (e) {
        console.warn("Skipping file", file);
      }
    }
  }

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { game: string } }) {
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

  let gameData: match | null = null;

  if (resultsDir) {
    const files = fs.readdirSync(resultsDir);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const filePath = path.join(resultsDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(fileContent) as match;
        if (parsed.slug === params.game) {
          gameData = parsed;
          break;
        }
      } catch (e) {
        console.warn("Error parsing file", file);
      }
    }
  }

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
  const [activeFilter, setActiveFilter] = useState<
    "all" | "goal" | "injury" | "modifier" | "break"
  >("all");
  const [isLogExpanded, setIsLogExpanded] = useState(false);

  const playClassify = (play: string) => {
    const p = play.toLowerCase();
    const isGoal =
      (p.includes("scores") ||
        p.includes("goal scored") ||
        p.includes("dunks the ball")) &&
      !p.includes("misses") &&
      !p.includes("advances towards");
    const isInjury =
      p.includes("injur") || p.includes("tackle") || p.includes("forfeit");
    const isBreak =
      p.includes("halftime") ||
      p.includes("overtime") ||
      p.includes("finished match");
    const isModifier =
      p.includes("heat") ||
      p.includes("sweat") ||
      p.includes("dehydration") ||
      p.includes("water") ||
      p.includes("sandstorm") ||
      p.includes("fumes") ||
      p.includes("mud") ||
      p.includes("wind") ||
      p.includes("snow") ||
      p.includes("blizzard") ||
      p.includes("sun") ||
      p.includes("fog") ||
      p.includes("glare") ||
      p.includes("vibration") ||
      p.includes("vine") ||
      p.includes("security") ||
      p.includes("echo") ||
      p.includes("ruin");

    if (isGoal) return "goal";
    if (isBreak) return "break";
    if (isInjury) return "injury";
    if (isModifier) return "modifier";
    return "normal";
  };

  const plays = gameData.plays || [];
  const goalCount = plays.filter((p) => playClassify(p) === "goal").length;
  const injuryCount = plays.filter((p) => playClassify(p) === "injury").length;
  const modifierCount = plays.filter(
    (p) => playClassify(p) === "modifier",
  ).length;
  const breakCount = plays.filter((p) => playClassify(p) === "break").length;

  const filteredPlays = plays.filter((play) => {
    if (activeFilter === "all") return true;
    const cat = playClassify(play);
    if (activeFilter === "goal" && cat === "goal") return true;
    if (activeFilter === "injury" && cat === "injury") return true;
    if (activeFilter === "modifier" && cat === "modifier") return true;
    if (activeFilter === "break" && cat === "break") return true;
    return false;
  });

  const {
    homeTeam,
    awayTeam,
    preGame,
    postGame,
    week: date,
    homeScore,
    awayScore,
  } = gameData as {
    homeTeam: team;
    awayTeam: team;
    preGame: string;
    postGame: string;
    week: number;
    homeScore: number;
    awayScore: number;
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-4 p-4">
        {/* Section 1: Score Result */}
        <Card className="w-full max-w-4xl bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />
          <CardBody className="p-8">
            {isScoreVisible ? (
              // Score Board
              <div className="flex flex-col md:flex-row justify-between items-start text-center gap-8">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-4 w-full md:w-5/12 group">
                  <div className="bg-gray-100/50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md group-hover:border-orange-500/30 transition-all duration-300">
                    <TeamIcon size={100} team={homeTeam.name} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-gray-100 font-sans tracking-tight uppercase group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                    {homeTeam.name}
                  </h2>
                </div>

                {/* Score numbers */}
                <div className="flex flex-col items-center justify-center w-full md:w-2/12 gap-2 my-4 md:my-0">
                  <div className="flex items-center justify-center gap-4 font-mono">
                    <span className="text-5xl md:text-6xl font-black text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] bg-gray-100/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 px-5 py-2.5 rounded-2xl">
                      {homeScore}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-2xl font-black">
                      :
                    </span>
                    <span className="text-5xl md:text-6xl font-black text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] bg-gray-100/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 px-5 py-2.5 rounded-2xl">
                      {awayScore}
                    </span>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200/30 dark:border-orange-900/30 mt-3 font-sans">
                    {homeScore > awayScore
                      ? "Home Win"
                      : awayScore > homeScore
                        ? "Away Win"
                        : "Tie"}
                  </span>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center gap-4 w-full md:w-5/12 group">
                  <div className="bg-gray-100/50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md group-hover:border-orange-500/30 transition-all duration-300">
                    <TeamIcon size={100} team={awayTeam.name} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-gray-100 font-sans tracking-tight uppercase group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                    {awayTeam.name}
                  </h2>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center p-6 min-h-[220px] gap-6">
                <div className="flex justify-around items-start text-center p-4 w-full">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-3 w-1/3">
                    <TeamIcon size={80} team={homeTeam.name} />
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200">
                      {homeTeam.name}
                    </h2>
                  </div>
                  <span className="text-xl font-bold text-gray-400 dark:text-gray-600">
                    VS
                  </span>
                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-3 w-1/3">
                    <TeamIcon size={80} team={awayTeam.name} />
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200">
                      {awayTeam.name}
                    </h2>
                  </div>
                </div>
                <div>
                  <button
                    className="cursor-pointer rounded-xl bg-orange-600 hover:bg-orange-500 transition-all px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/10 dark:shadow-orange-950/20 text-lg uppercase tracking-wider"
                    onClick={() => setIsScoreVisible(true)}
                  >
                    Reveal Final Score
                  </button>
                </div>
              </div>
            )}
          </CardBody>
          <Divider className="bg-gray-250 dark:bg-gray-800/80" />
          <CardFooter className="flex justify-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50/40 dark:bg-gray-950/40 py-3">
            Round {date + 1} at {homeTeam.stadium.name}
          </CardFooter>
        </Card>

        {/* Stadium & Active Modifiers Section */}
        {homeTeam?.stadium && (
          <Card className="w-full max-w-4xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden relative">
            <CardBody className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-950/40 px-2 py-1 rounded border border-orange-200/30 dark:border-orange-900/30">
                    🏟️ Home Stadium
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mt-2 text-gray-850 dark:text-gray-100 font-sans">
                    {homeTeam.stadium.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <span>📍</span> {homeTeam.stadium.location}
                  </p>
                </div>
              </div>
              <p className="text-sm italic text-gray-700 dark:text-gray-300 border-l-2 border-orange-500 pl-4 mb-6 leading-relaxed">
                &ldquo;{homeTeam.stadium.description}&rdquo;
              </p>

              {gameData.activeModifiers &&
                gameData.activeModifiers.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 font-sans">
                      Active Stadium Modifiers
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {gameData.activeModifiers.map((modName) => {
                        const modifier = GAME_MODIFIERS[modName];
                        return (
                          <div
                            key={modName}
                            className="bg-gray-50 dark:bg-gray-900/60 border border-gray-250 dark:border-gray-800/80 rounded-xl p-4 transition-all duration-300 hover:border-orange-500/50 hover:bg-gray-100 dark:hover:bg-gray-900/80 shadow-md flex flex-col gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base text-orange-400">
                                ⚠️
                              </span>
                              <span className="font-bold text-gray-800 dark:text-gray-100 text-sm font-sans">
                                {modName}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                              {modifier
                                ? modifier.description
                                : "Environmental conditions are affecting play."}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </CardBody>
          </Card>
        )}

        {/* Play-by-Play Console Terminal */}
        {isScoreVisible && plays.length > 0 && (
          <Card className="w-full max-w-4xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-600" />
            <CardBody className="p-6">
              <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏈</span>
                  <h3 className="text-lg font-bold text-gray-850 dark:text-gray-100 font-sans uppercase tracking-wider">
                    Play-by-Play Arena Log
                  </h3>
                </div>
                <button
                  onClick={() => setIsLogExpanded(!isLogExpanded)}
                  className="cursor-pointer px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl text-xs uppercase tracking-wider font-sans font-bold transition-all"
                >
                  {isLogExpanded ? "Hide Logs ▲" : "Show Logs ▼"}
                </button>
              </div>

              {isLogExpanded && (
                <div className="mt-6">
                  {/* Terminal filters */}
                  <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 dark:border-gray-900 pb-4">
                    <button
                      onClick={() => setActiveFilter("all")}
                      className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all border ${
                        activeFilter === "all"
                          ? "bg-gray-250 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                          : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      }`}
                    >
                      All Logs ({plays.length})
                    </button>
                    <button
                      onClick={() => setActiveFilter("goal")}
                      className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all border ${
                        activeFilter === "goal"
                          ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400"
                          : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-500"
                      }`}
                    >
                      🏆 Goals ({goalCount})
                    </button>
                    <button
                      onClick={() => setActiveFilter("injury")}
                      className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all border ${
                        activeFilter === "injury"
                          ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-700 text-red-700 dark:text-red-400"
                          : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900 text-gray-400 dark:text-gray-500 hover:text-red-650 dark:hover:text-red-500"
                      }`}
                    >
                      💥 Combat ({injuryCount})
                    </button>
                    <button
                      onClick={() => setActiveFilter("modifier")}
                      className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all border ${
                        activeFilter === "modifier"
                          ? "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-400"
                          : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900 text-gray-400 dark:text-gray-500 hover:text-orange-650 dark:hover:text-orange-500"
                      }`}
                    >
                      ⚠️ Stadium ({modifierCount})
                    </button>
                    <button
                      onClick={() => setActiveFilter("break")}
                      className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all border ${
                        activeFilter === "break"
                          ? "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400"
                          : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900 text-gray-400 dark:text-gray-500 hover:text-amber-650 dark:hover:text-amber-500"
                      }`}
                    >
                      📢 Breaks ({breakCount})
                    </button>
                  </div>

                  {/* Terminal screen container */}
                  <div className="bg-gray-50 dark:bg-black/90 rounded-xl p-4 md:p-6 h-[400px] overflow-y-auto border border-gray-200 dark:border-gray-900 font-mono text-xs md:text-sm shadow-inner flex flex-col gap-2.5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    {filteredPlays.map((play, index) => {
                      const cat = playClassify(play);

                      if (cat === "break") {
                        return (
                          <div
                            key={index}
                            className="text-amber-700 dark:text-amber-400 font-extrabold bg-amber-50 dark:bg-amber-950/15 border-y border-amber-250 dark:border-amber-900/30 py-3 text-center uppercase tracking-wider my-4 block w-full text-xs md:text-sm font-sans"
                          >
                            <span className="mr-2.5">📢</span>
                            {play}
                          </div>
                        );
                      }

                      let textClass =
                        "text-gray-700 dark:text-gray-300 flex items-start gap-2.5 w-full py-0.5 px-3";
                      let badge = "";
                      let prefix = "•";

                      if (cat === "goal") {
                        textClass =
                          "text-gray-800 dark:text-gray-100 font-medium bg-green-50 dark:bg-green-950/15 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-900/20 flex items-start gap-2.5 w-full";
                        badge = "GOAL";
                        prefix = "🏆";
                      } else if (cat === "injury") {
                        textClass =
                          "text-gray-800 dark:text-gray-100 font-medium bg-red-50 dark:bg-red-950/15 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/20 flex items-start gap-2.5 w-full";
                        badge = "COMBAT";
                        prefix = "💥";
                      } else if (cat === "modifier") {
                        textClass =
                          "text-gray-800 dark:text-gray-100 font-medium bg-orange-50 dark:bg-orange-950/15 px-3 py-1.5 rounded-lg border border-orange-200 dark:border-orange-900/20 flex items-start gap-2.5 w-full";
                        badge = "STADIUM";
                        prefix = "⚠️";
                      }

                      return (
                        <div key={index} className={textClass}>
                          <span className="opacity-75 mt-0.5 shrink-0 text-sm">
                            {prefix}
                          </span>
                          {badge && (
                            <span
                              className={`text-[9px] font-sans font-black px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 mt-0.5 ${
                                cat === "goal"
                                  ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/40"
                                  : cat === "injury"
                                    ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/40"
                                    : "bg-orange-100 dark:bg-orange-900/50 text-orange-750 dark:text-orange-300 border border-orange-200 dark:border-orange-800/40"
                              }`}
                            >
                              {badge}
                            </span>
                          )}
                          <span className="leading-relaxed mt-0.5">{play}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        )}
        {/* Sections 2 & 3: Pregame / Postgame */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-4">
          {/* Pregame Summary */}
          <Card className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-orange-600/50" />
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🎙️</span>
                <h3 className="text-lg font-bold text-gray-850 dark:text-gray-100 font-sans uppercase tracking-wider">
                  Pregame Broadcast
                </h3>
              </div>
              <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300 max-w-none text-sm leading-relaxed">
                <ReactMarkdown>{formatText(preGame)}</ReactMarkdown>
              </div>
            </CardBody>
          </Card>

          {/* Postgame Wrapup */}
          <Card className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-orange-600/50" />
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📊</span>
                <h3 className="text-lg font-bold text-gray-850 dark:text-gray-100 font-sans uppercase tracking-wider">
                  Postgame Wrap-Up
                </h3>
              </div>
              <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300 max-w-none text-sm leading-relaxed">
                {isScoreVisible ? (
                  <ReactMarkdown>{formatText(postGame)}</ReactMarkdown>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <span className="text-3xl mb-2">🔒</span>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      Postgame commentary is locked until you reveal the final
                      score.
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}
