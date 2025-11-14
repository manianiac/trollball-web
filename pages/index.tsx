import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center text-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title()}>
          <span>
            Welcome Heroes, Villains, and Osterrans!
            <br />
            You&apos;re Tuned In&nbsp;
          </span>
          <span>to the Trollball League!</span>
        </h1>
        <div className={subtitle({ class: "mt-4" })}>
          Nok here, your humble host! I&apos;m watching from above and ready to
          bring you the full, unadulterated, play-by-play of every single game.
          We&apos;re talking stats, scores, and all the glorious chaos. Whether
          you&apos;re tuning in from down the street or tapping into the feed
          from another dimension, you&apos;ve found the best show in the
          multiverse!
        </div>
      </div>
    </DefaultLayout>
  );
}
