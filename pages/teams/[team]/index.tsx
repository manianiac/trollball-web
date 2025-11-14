// app/teams/[slug]/page.jsx
import Error from "next/error";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Key } from "react";

import { TEAMS } from "../../../utils/teams";

import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { player, stats, team } from "@/utils/consts";
import { TeamIcon } from "@/components/icons";

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
    fallback: false, // This means any slug not listed here will 404
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
    // We return the official 404 Error component!
    return <Error statusCode={404} />;
  }
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          const ratingValue = i + 1;

          if (rating >= ratingValue) {
            return (
              <span key={`full-${i}`} className="text-2xl text-yellow-400">
                ★
              </span>
            );
          } else if (rating >= ratingValue - 0.5) {
            return (
              <span
                key={`half-${i}`}
                className="relative inline-block text-2xl"
              >
                {/* Background empty star */}
                <span className="text-gray-500">☆</span>
                {/* Foreground filled star, clipped to a half */}
                <span className="absolute top-0 left-0 h-full w-1/2 overflow-hidden text-yellow-400">
                  ★
                </span>
              </span>
            );
          } else {
            return (
              <span key={`empty-${i}`} className="text-2xl text-gray-500">
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
    { label: "Civic Engagement", value: stats.civic_engagement },
    { label: "Alcohol Tolerance", value: stats.alcohol_tolerance },
  ];

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <TeamIcon
          className="object-cover h-[140px]" // <-- Removed 'w-full'
          team={team.name}
        />
        <div className="inline-block max-w-xl text-center justify-center">
          {/* You can use your title/subtitle styles here! */}
          <h1 className={title()}>{team.name}</h1>
          <div className={subtitle({ class: "mt-4" })}>
            <strong>Home Field:</strong> {team.stadium.name}
            <br />
            <strong>Location:</strong> {team.stadium.location}
            <p className="mt-2 text-sm">{team.stadium.description}</p>
            <strong>Healer:</strong> {team.healer.name}
          </div>
        </div>
        <div className="gap-2 grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {team.players.map((player: player, index: Key) => (
            <Card key={index} shadow="sm">
              <CardHeader className="flex flex-col gap-4">
                <strong>{player.name}</strong>
              </CardHeader>
              <CardBody className="flex flex-col gap-4">
                {/* --- Text Stats --- */}
                <div className="flex flex-col gap-1 text-sm">
                  <p>
                    <strong>Pronouns:</strong> {player.stats.pronouns}
                  </p>
                  <p>
                    <strong>Favorite Weapon:</strong>{" "}
                    {player.stats.favorite_weapon}
                  </p>
                  <p>
                    <strong>Pregame Ritual:</strong>{" "}
                    {player.stats.pregame_ritual}
                  </p>
                  <p>
                    <strong>Literate:</strong>{" "}
                    {player.stats.literate ? "Yes" : "No"}
                  </p>
                </div>
                {/* --- Numerical Stats --- */}
                <div className="flex flex-col gap-3">
                  {getNumericalStats(player.stats).map((stat) => {
                    const clampedValue = Math.max(20, Math.min(80, stat.value));
                    const normalizedValue = clampedValue - 20;
                    const ratingOutOfFive = (normalizedValue / 60) * 5;
                    const roundedRating = Math.round(ratingOutOfFive * 2) / 2;

                    return (
                      <div
                        key={stat.label}
                        className="flex flex-col justify-between items-center w-full"
                      >
                        <span className="text-sm font-medium">
                          {stat.label}
                        </span>
                        <StarRating rating={roundedRating} />
                      </div>
                    );
                  })}
                </div>

                <hr className="my-2 border-gray-600" />
              </CardBody>
              {/* <CardFooter className="text-small justify-between">
                    {JSON.stringify(team.stadium).toString()}
                  </CardFooter> */}
            </Card>
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}
