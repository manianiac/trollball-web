// app/teams/[slug]/page.jsx

import { notFound } from "next/navigation";

import { TEAMS } from "../../utils/teams";

import { subtitle, title } from "@/components/primitives";
import { useRouter } from "next/router";

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
  // const team = getTeamBySlug(params.team.toString());

  if (!team) {
    notFound(); // This will show a 404 page
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        {/* You can use your title/subtitle styles here! */}
        <h1 className={title()}>{team.name}</h1>
        <div className={subtitle({ class: "mt-4" })}>
          <strong>Home Field:</strong> TODO
          <br />
          <p>{team.healer.name}</p>
        </div>
      </div>
    </section>
  );
}
