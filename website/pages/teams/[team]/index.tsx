import Error from "next/error";
import React, { Key } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";

import { TEAMS } from "../../../../shared/teams";
import { TeamIcon } from "../../../components/icons";
import DefaultLayout from "../../../layouts/default";
import { team, player, stats } from "../../../../shared/types";

const getTeamBySlug = (slug: string) => {
  return Object.values(TEAMS).find((team) => team.slug === slug);
};

export async function getStaticPaths() {
  const paths = Object.values(TEAMS)
    .filter((team) => team && team.slug)
    .map((team) => ({
      params: { team: team.slug },
    }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { team: string } }) {
  const team = getTeamBySlug(params.team.toString());

  if (!team) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      team,
    },
  };
}

export default function TeamPage({ team }: { team: team }) {
  if (!team) {
    return <Error statusCode={404} />;
  }

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const ratingValue = i + 1;
          if (rating >= ratingValue) {
            return (
              <span
                key={`full-${i}`}
                className="text-lg text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
              >
                ★
              </span>
            );
          } else if (rating >= ratingValue - 0.5) {
            return (
              <span key={`half-${i}`} className="relative inline-block text-lg">
                <span className="text-gray-300 dark:text-gray-700">☆</span>
                <span className="absolute top-0 left-0 h-full w-1/2 overflow-hidden text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                  ★
                </span>
              </span>
            );
          } else {
            return (
              <span
                key={`empty-${i}`}
                className="text-lg text-gray-300 dark:text-gray-700"
              >
                ☆
              </span>
            );
          }
        })}
      </div>
    );
  };

  const getNumericalStats = (stats: stats) => [
    { label: "Pass", value: stats.pass },
    { label: "Catch", value: stats.catch },
    { label: "Run", value: stats.run },
    { label: "Block", value: stats.block },
    { label: "Fight", value: stats.fight },
    { label: "Throw", value: stats.throw },
    { label: "Luck", value: stats.luck },
  ];

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-8 p-4 md:p-8 w-full">
        {/* Team Hero Section */}
        <div className="w-full max-w-5xl rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />
          <div className="bg-gray-50 dark:bg-gray-900/40 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md shrink-0">
            <TeamIcon size={140} team={team.name} />
          </div>
          <div className="flex-1 text-center md:text-left min-w-0">
            <h1
              className="font-black tracking-tight text-gray-900 dark:text-white font-sans uppercase break-words text-balance"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
            >
              {team.name}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm text-gray-700 dark:text-gray-300">
              <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-900 rounded-xl p-3">
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider font-semibold">
                  🏟️ Home Field
                </span>
                <strong className="text-gray-900 dark:text-gray-100 mt-1 block">
                  {team.stadium.name}
                </strong>
                <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                  📍 {team.stadium.location}
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-900 rounded-xl p-3">
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider font-semibold">
                  🛡️ Sponsor
                </span>
                <strong className="text-gray-900 dark:text-gray-100 mt-1 block">
                  {team.sponsor || "None"}
                </strong>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-900 rounded-xl p-3">
                <span className="text-gray-500 dark:text-gray-400 block text-xs uppercase tracking-wider font-semibold">
                  🧙 Healer
                </span>
                <strong className="text-gray-900 dark:text-gray-100 mt-1 block">
                  {team.healer.name}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Stadium Lore Description block */}
        <div className="w-full max-w-5xl bg-gray-50 dark:bg-gray-950/40 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-6">
          <h2 className="text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold mb-2">
            Stadium Background
          </h2>
          <p className="text-sm italic text-gray-700 dark:text-gray-300 border-l-2 border-orange-500 pl-4 leading-relaxed">
            &ldquo;{team.stadium.description}&rdquo;
          </p>
        </div>

        {/* Roster Section */}
        <div className="w-full max-w-5xl flex flex-col gap-6">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 border-l-4 border-orange-500 pl-4 pb-1 font-sans">
            Active Roster
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!!team.players &&
              team.players.map((player: player, index: Key) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl hover:border-orange-500/30 hover:scale-[1.005] hover:shadow-orange-500/10 dark:hover:shadow-orange-950/10 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 group-hover:from-orange-500 group-hover:to-amber-500 transition-all duration-300" />
                  <CardHeader className="flex justify-between items-center px-5 pt-5 pb-3">
                    <strong className="text-lg font-black text-gray-850 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors font-sans truncate">
                      {player.name}
                    </strong>
                  </CardHeader>
                  <CardBody className="px-5 pb-5 pt-1 flex flex-col gap-4">
                    {/* --- Text Stats --- */}
                    <div className="bg-gray-50 dark:bg-black/40 border border-gray-150 dark:border-gray-900 rounded-xl p-3 text-xs flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          Pronouns
                        </span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">
                          {player.stats.pronouns}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          Favorite Weapon
                        </span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold mt-0.5">
                          {player.stats.favorite_weapon}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          Pregame Ritual
                        </span>
                        <span className="text-gray-800 dark:text-gray-200 font-semibold italic mt-0.5">
                          &ldquo;{player.stats.pregame_ritual}&rdquo;
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          Literate
                        </span>
                        <span
                          className={
                            player.stats.literate
                              ? "text-green-600 dark:text-green-400 font-semibold"
                              : "text-amber-600 dark:text-amber-500 font-semibold"
                          }
                        >
                          {player.stats.literate ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    {/* --- Numerical Stats --- */}
                    <div className="flex flex-col gap-2">
                      {getNumericalStats(player.stats).map((stat) => {
                        const clampedValue = Math.max(
                          20,
                          Math.min(80, stat.value),
                        );
                        const normalizedValue = clampedValue - 20;
                        const ratingOutOfFive = (normalizedValue / 60) * 5;
                        const roundedRating =
                          Math.round(ratingOutOfFive * 2) / 2;

                        return (
                          <div
                            key={stat.label}
                            className="flex justify-between items-center w-full"
                          >
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono">
                              {stat.label}
                            </span>
                            <StarRating rating={roundedRating} />
                          </div>
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>
              ))}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
