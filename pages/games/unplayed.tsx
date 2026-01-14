import React from "react";
import { Card, CardBody } from "@heroui/card";
import DefaultLayout from "@/layouts/default";
import Link from "next/link";

export default function UnplayedGamePage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <Card className="max-w-md w-full p-8">
          <CardBody className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold text-default-900">
              Match Not Played
            </h1>
            <div className="text-6xl">🚫</div>
            <p className="text-lg text-default-600">
              This game was scheduled as part of a Best of 3 series, but the
              series was decided before this match was necessary.
            </p>
            <div className="p-4 bg-default-100 rounded-lg">
              <p className="font-semibold">Winner Determined via 2-0 Sweep</p>
            </div>

            <Link
              href="/games"
              className="mt-4 px-6 py-2 rounded-full bg-primary text-white hover:bg-primary-600 transition-colors"
            >
              Back to Series
            </Link>
          </CardBody>
        </Card>
      </section>
    </DefaultLayout>
  );
}
