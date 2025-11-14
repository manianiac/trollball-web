import { Card, CardBody, CardFooter } from "@heroui/card";

import { TEAMS } from "../../utils/teams";

import DefaultLayout from "@/layouts/default";
import { Link } from "@heroui/link";

export default function TeamsPage() {
  return (
    <DefaultLayout>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {Object.values(TEAMS).map((team, index) => (
          <Link key={index} href={`/teams/${team.slug}`}>
            <Card key={index} shadow="sm">
              <CardBody className="overflow-visible p-0">{team.name}</CardBody>
              <CardFooter className="text-small justify-between">
                {JSON.stringify(team.stadium).toString()}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </DefaultLayout>
  );
}
