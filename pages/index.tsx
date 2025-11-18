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
            {formatText(`Helloooooo fiends and fanatics, and welcome back! This is your favorite demon of the airwaves, Nok the Corrupter, here to introduce the one and only magical hub for the greatest sport ever conceived!

Forget those dusty, "hallowed" libraries in Haven or the self-important ranger reports from Sir Randy and his FANCY bow. *This* is where the real action lives! We’ve organized all the glorious carnage, every bone-crunching tackle, and every magnificent knockout into three beautiful pages, just for you delightful degenerates!

### [🏟️ The "Games" Page](https://blacksky.wiki/games)

Want to know who got pulverized last night? Thirsty for the gory details of every brutal shutout and nail-biting overtime brawl? The **Games** page is your personal, blood-soaked ledger!

This is the beating heart of the sport, folks! We've got the full schedule, the final scores, and, of course, my very own masterful post-game reports. I'll give you the play-by-play on every spectacular knockout, every humiliating fumble, and every game-winning charge. This is where you relive the glory!

### [🪓 The "Teams" Page](https://blacksky.wiki/teams)

Who are these magnificent brutes? Who are these titans of the turf and masters of mayhem? The **Teams** page is your official guide to the warriors who make this sport so spectacular!

Forget those so-called "heroes" like that preening "celebrity" Sir Artorias or that Bog Queen Valos the Eternal. These are the *real* athletes! Get the inside scoop on every squad, from the **New Ravenfall Commanders** to the **Wyrmwood Stronghammers**. You'll find their full rosters, their player stats, and my favorite part: their wonderfully bizarre pre-game rituals!

Who gets ready by chugging a raw egg, shell and all? Who kisses their own biceps for good luck? Who eats a raw onion, layer by layer, without crying? It's all in here, and it's all glorious!

### [🎙️ The "Blog" Page](https://blacksky.wiki/blog)

You want the real story? You want the unfiltered truth you won't get from some "official" decree written by a king or a count?

The **Blog** is where *I*, Nok the Corrupter, give you my unfiltered analysis, opinions, and predictions! This is the word, straight from the demon's mouth! This isn't some prissy gossip column about what Dame Terra Monteforte is digging up this week. This is real Trollball talk! I'll be breaking down the most spectacular plays, ranking the most brutal brawlers, and keeping you up-to-date on all the league news that's fit to print in blood!

---

So what are you waiting for? Click those pages! Gorge yourselves on the stats! Revel in the glorious violence! This is **TROLLBALL**, and it's never been better!`)}
          </ReactMarkdown>
        </div>
      </div>
    </DefaultLayout>
  );
}
