import ReactMarkdown from "react-markdown";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { formatText } from "@/utils/utils";

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
          <ReactMarkdown>
            {formatText(`# TUESDAY NIGHT TROLLBALL

***

### "Live from the jagged peaks of the Void to the rolling hills of Eponore, it's the sport that refuses to stay dead!"

**Your Host: Nok the Corrupter**

Good evening, sports fans, thrill-seekers, and sentient oozes! Pull up a chair, pour yourself a pint of Imra's finest dust-brew, and turn your ears this way! You are listening to the golden voice of **Tuesday Night Trollball**, coming to you LIVE across the planes of Osterra!

Since my liberation from that dusty old Demon Prison—thanks to the "heroic" efforts of **Morgwae** and the celebrity-king **Artorias** (a demon's gotta pay his debts, folks!)—I have dedicated my immortal existence to one thing: **THE BEAUTIFUL GAME.**

We are living in the age of the **Everwar**, folks! Where death is just a halftime break and the memories of your demise wash away like blood in the rain! So why *not* spend your immortality smashing your neighbor with a morning star for possession of a leather troll head? 

It's fast! It's brutal! It's the only game where "unnecessary roughness" is a requirement! It's **TROLLBALL!**

***

## LEAGUE NAVIGATION

Don't be shy, click around! See the carnage for yourself!

### 🏈 [GAME REPORTS](/games)
Did you miss the match? Shame on you! Read the play-by-play breakdowns here. Find out who scored, who died, and who got back up to die again!

### 🛡️ [THE TEAMS](/teams)
Check the rosters! From the pathetic **Haven Lights** (boo!) to the glorious, unstoppable juggernauts, the **Ebon Gate Corruptors** (YEAH!), see who is taking the field this week.

### 🏆 [SEASON STANDINGS](/standings)
Numbers don't lie, folks. See who is king of the hill and who is rotting in the cellar. Tracking kills, goals, and total regenerations!

### 📅 [SCHEDULE](/schedule)
Mark your calendars! Find out when your favorite(or least favorite) team is playing next!

### 🎙️ [NOK'S BLOG](/blog)
Weekly recaps, rumors, betting odds (though **Yarp** won't take my money), and my personal musings on why **Nikos Thanae** is the worst person in the realm.

***

### SO TUNE IN!

The leather is tough, the steel is sharp, and the magic is unstable! It's **Tuesday Night Trollball**! 

*And remember, if the **Haven Lights** are playing, I'm rooting for the other guys!*`)}
          </ReactMarkdown>
        </div>
      </div>
    </DefaultLayout>
  );
}
