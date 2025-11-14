import { Card, CardBody, CardFooter } from "@heroui/card";
import { Link } from "@heroui/link";

import { TEAMS } from "../../utils/teams";

import DefaultLayout from "@/layouts/default";
import { TeamIcon } from "@/components/icons";

export default function TeamsPage() {
  return (
    <DefaultLayout>
      <div className="gap-2 grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {Object.values(TEAMS).map((team, index) => (
          <Link key={index} href={`/teams/${team.slug}`}>
            <Card key={index} shadow="sm" className="w-full">
              <CardBody className="overflow-visible p-2 flex justify-center items-center">
                <TeamIcon
                  className="object-cover h-[140px]" // <-- Removed 'w-full'
                  team={team.name}
                />
              </CardBody>
              <CardFooter className="text-small justify-between min-h-[60px]">
                {" "}
                <b>{team.name}</b>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </DefaultLayout>
  );
}
