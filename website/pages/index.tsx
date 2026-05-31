import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import DefaultLayout from "../layouts/default";
import {
  BlogIcon,
  MatchIcon,
  ScheduleIcon,
  TeamsIcon,
  MegaphoneIcon,
} from "../components/icons";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center gap-10 py-6 w-full">
        {/* Hero Section */}
        <div className="w-full max-w-4xl text-center py-10 px-6 rounded-3xl bg-gradient-to-r from-orange-600/10 via-amber-600/15 to-orange-600/10 border border-orange-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans">
            TUESDAY NIGHT <span className="text-orange-500">TROLLBALL</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium italic">
            &ldquo;Live from the jagged peaks of the Void to the rolling hills
            of Eponore, it&rsquo;s the sport that refuses to stay dead!&rdquo;
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Card 1: Match Reports */}
          <Link href="/games" className="block group">
            <Card className="h-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 group-hover:border-orange-500/50 transition-all duration-300 shadow-md group-hover:shadow-orange-500/10 dark:group-hover:shadow-orange-950/20 hover:scale-[1.01] overflow-hidden relative">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-50 dark:bg-orange-950/50 border border-orange-200/50 dark:border-orange-800/40 w-12 h-12 rounded-xl flex items-center justify-center p-2">
                    <MatchIcon size={28} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                      Match Reports
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Read detailed play-by-play logs, scores, and active
                      stadium modifiers.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>

          {/* Card 2: The Teams */}
          <Link href="/teams" className="block group">
            <Card className="h-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 group-hover:border-orange-500/50 transition-all duration-300 shadow-md group-hover:shadow-orange-500/10 dark:group-hover:shadow-orange-950/20 hover:scale-[1.01] overflow-hidden relative">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-50 dark:bg-orange-950/50 border border-orange-200/50 dark:border-orange-800/40 w-12 h-12 rounded-xl flex items-center justify-center p-2">
                    <TeamsIcon size={28} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                      The Teams
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Browse league team standings, player rosters, and weapons.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>

          {/* Card 3: Schedule */}
          <Link href="/schedule" className="block group">
            <Card className="h-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 group-hover:border-orange-500/50 transition-all duration-300 shadow-md group-hover:shadow-orange-500/10 dark:group-hover:shadow-orange-950/20 hover:scale-[1.01] overflow-hidden relative">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-50 dark:bg-orange-950/50 border border-orange-200/50 dark:border-orange-800/40 w-12 h-12 rounded-xl flex items-center justify-center p-2">
                    <ScheduleIcon size={28} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                      League Schedule
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Check out upcoming games and tournament brackets.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>

          {/* Card 4: Nok's Blog */}
          <Link href="/blog" className="block group">
            <Card className="h-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 group-hover:border-orange-500/50 transition-all duration-300 shadow-md group-hover:shadow-orange-500/10 dark:group-hover:shadow-orange-950/20 hover:scale-[1.01] overflow-hidden relative">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-50 dark:bg-orange-950/50 border border-orange-200/50 dark:border-orange-800/40 w-12 h-12 rounded-xl flex items-center justify-center p-2">
                    <BlogIcon size={28} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                      Nok&rsquo;s Blog
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Weekly recaps, rumors, betting tips, and arena rants.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>

        {/* Welcome message scroll */}
        <Card className="w-full max-w-4xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-orange-500" />
          <CardBody className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-50 dark:bg-orange-950/50 border border-orange-200/50 dark:border-orange-800/40 w-12 h-12 rounded-xl flex items-center justify-center p-2">
                <MegaphoneIcon size={28} className="text-orange-500" />
              </div>{" "}
              <h2 className="text-xl font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 font-sans">
                Broadcasting Live: Nok the Corrupter
              </h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base space-y-4">
              <p>
                Good evening, sports fans, thrill-seekers, and sentient oozes!
                Pull up a chair, pour yourself a pint of Imra&rsquo;s finest
                dust-brew, and turn your ears this way! You are listening to the
                golden voice of <strong>Tuesday Night Trollball</strong>, coming
                to you LIVE across the planes of Osterra!
              </p>
              <p>
                Since my liberation from that dusty old Demon
                Prison&mdash;thanks to the &ldquo;heroic&rdquo; efforts of{" "}
                <strong>Morgwae</strong> and the celebrity-king{" "}
                <strong>Artorias</strong> (a demon&rsquo;s gotta pay his debts,
                folks!)&mdash;I have dedicated my immortal existence to one
                thing: <strong>THE BEAUTIFUL GAME.</strong>
              </p>
              <p>
                We are living in the age of the <strong>Everwar</strong>, folks!
                Where death is just a halftime break and the memories of your
                demise wash away like blood in the rain! So why not spend your
                immortality smashing your neighbor with a morning star for
                possession of a leather troll head?
              </p>
              <p>
                It&rsquo;s fast! It&rsquo;s brutal! It&rsquo;s the only game
                where &ldquo;unnecessary roughness&rdquo; is a requirement!
                It&rsquo;s <strong>TROLLBALL!</strong>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
}
