// app/teams/[slug]/page.jsx
import Error from "next/error";
import { Card, CardBody, CardHeader } from "@heroui/card";

import { TEAMS } from "../../../utils/teams";

import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

const getTeamBySlug = (slug: string) => {
  return Object.values(TEAMS).find((team) => team.slug === slug);
};

export async function getStaticPaths() {
  const paths = Object.values(TEAMS)
    .filter((team) => team && team.slug) // <-- Kept our safety filter!
    .map((team) => ({
      params: { team: team.slug }, // 'team' MUST match the file name [team].jsx
    }));

  return {
    paths,
    fallback: false, // This means any slug not listed here will 404
  };
}
export async function getStaticProps({ params }) {
  // 'params.team' comes from the file name and getStaticPaths
  const team = getTeamBySlug(params.team.toString());

  // This is the correct way to handle "Not Found" in the Pages Router
  if (!team) {
    return {
      notFound: true,
    };
  }

  // We pass the 'team' data as a prop to our component
  return {
    props: {
      team,
    },
  };
}
export default function TeamPage({ team }) {
  if (!team) {
    // We return the official 404 Error component!
    return <Error statusCode={404} />;
  }
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          const ratingValue = i + 1; // This star represents 1, 2, 3, 4, or 5

          // This is the play!
          if (rating >= ratingValue) {
            // If rating is 2.5, and this star is 1 or 2... FULL STAR!
            return (
              <span key={`full-${i}`} className="text-2xl text-yellow-400">
                ★
              </span>
            );
          } else if (rating >= ratingValue - 0.5) {
            // If rating is 2.5, and this star is 3... (2.5 >= 3 - 0.5)... HALF STAR!
            // Golly, what a beautiful piece of code!
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
            // If rating is 2.5, and this star is 4 or 5... EMPTY STAR!
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
  const getNumericalStats = (stats) => [
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
        <div className="inline-block max-w-xl text-center justify-center">
          {/* You can use your title/subtitle styles here! */}
          <h1 className={title()}>{team.name}</h1>
          <div className={subtitle({ class: "mt-4" })}>
            <strong>Home Field:</strong> TODO
            <br />
            <p>{team.healer.name}</p>
            <div className="gap-2 grid grid-cols-2 sm:grid-cols-2">
              {team.players.map((player, index) => (
                <Card key={index} shadow="sm">
                  <CardHeader className="overflow-visible p-0">
                    {player.name}
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
                        const clampedValue = Math.max(
                          20,
                          Math.min(80, stat.value)
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
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
