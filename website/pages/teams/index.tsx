import React from "react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";

import { TEAMS } from "../../../shared/teams";
import DefaultLayout from "../../layouts/default";
import { TeamIcon } from "../../components/icons";

export default function TeamsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-6 p-4 md:p-8 w-full">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2 font-sans">
          The Teams
        </h1>
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full max-w-5xl">
          {Object.values(TEAMS).map((team, index) => (
            <Link
              key={index}
              href={`/teams/${team.slug}`}
              className="block group"
            >
              <Card className="h-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 group-hover:border-orange-500/30 transition-all duration-300 shadow-lg hover:scale-[1.01] overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600/30 to-amber-600/30 group-hover:from-orange-500 group-hover:to-amber-500 transition-all duration-300" />
                <CardBody className="overflow-visible p-6 flex flex-col justify-center items-center gap-4 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-250 dark:border-gray-800/80 group-hover:border-orange-500/20 shadow-md transition-all">
                    <TeamIcon size={96} team={team.name} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-extrabold text-base text-gray-800 dark:text-gray-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors font-sans text-balance leading-snug">
                      {team.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-words">
                      🏟️ {team.stadium.name}
                    </p>
                    {team.sponsor && (
                      <p className="text-xs text-orange-600 dark:text-orange-400/90 font-medium mt-0.5 break-words">
                        🛡️ {team.sponsor}
                      </p>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}
