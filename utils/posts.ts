/**
 * Defines the structure for a single blog post.
 */
export interface BlogPost {
  id: string; // A unique slug-like ID for the post
  title: string;
  date: string; // A simple display string like "November 14, 2025"
  author: string;
  /**
   * The full content of the post, written in Markdown.
   * Use \n\n for new paragraphs.
   */
  content: string;
}

/**
 * YOUR BLOG POST "DATABASE"
 * To add a new post, just add a new object to the top of this array.
 * The blog page will update automatically.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "preseason-recap",
    title: "Preseason Week Was a Glorious, Bone-Crunching Start!",
    date: "November 14, 2025",
    author: "Nok the Corrupter",
    content: `Helloooooo Trollball fanatics, and welcome back! This is your favorite fiend of the field, Nok the Corrupter, and OH, WHAT A PRESEASON IT WAS!

If that was just the appetizer, folks, the inaugural season is going to be a feast of glorious, bone-crunching carnage! We saw it all: dominant shutouts, mind-boggling incompetence, and nail-biting finishes that went right down to the wire! This isn't some prissy tournament for "heroes" like Sir Tanos or Sir Artorias; this is real, blood-and-guts sport, and it was beautiful!

Let's break down the beautiful brutality we all just witnessed!

### 🛡️ The Wall of Zero!

My dark heart sings when I see a team's spirit get crushed into a fine powder! We were blessed with **five magnificent shutouts** this preseason!

* The **South Pole Yetis** marched right up that mountain and put the **Oread's Summit Tamers** on ice with a 2-0 victory! Selima Si was a force of nature, and the Tamers just couldn't answer back!
* The **Tortell Privateers** sailed into the Unruly Yard and taught the **New Monteforte Chaos Creatures** a lesson in hard-nosed defense, winning 2-0! Dib Tufts, the man who chugs raw eggs, scored a goal! That's the kind of grit you can't buy!
* But my absolute favorite? Oh, it has to be **Oak & Onslaught** traveling to the oh-so-pristine "Aegis Field" and shutting out **The Haven Lights** 2-0! They walked onto that "Hallowed Ground" and defiled it with a glorious victory! You just love to see it!
* Even those fancy-pants mountain-dwellers, **The Confluence Captains**, got in on the action, holding the **Brimstone Fire Eaters** to nothing in a 2-0 win. And the **Starlight Bazaar Bizarres** ground out a 1-0 win over the **New Prosperity Profits** in a defensive slugfest!

### 😵 The Fine Art of Incompetence!

Folks, it takes skill to be good, but it takes a special kind of *genius* to be this spectacularly chaotic! We saw two displays of self-destruction that will be sung about for ages!

* First, a hearty congratulations to **Swamy Ahasuerus** of the Summit Tamers, who, in a magnificent display of pure Trollball spirit, managed to knock **HERSELF** out with her own axe! You can't make this stuff up!
* But the undisputed champion of the preseason, the legend we will tell our spawn about, is **Bahr Ethelstan** of the Desert Spectres! This magnificent warrior managed to knock *themselves out* not once, but **TWICE** in the same game! That's a level of artistry that those "heroes" like Sir Garon Ironrock, with all his doors and his rules, could never understand! It was pure, unadulterated poetry!

### 💥 The Nail-Biting Finishes!

It wasn't all one-sided! We were treated to two glorious, heart-stopping overtime slugfests!

* **The Kerlauger Runeguard** snatched victory from the jaws of defeat against the **Wyrmwood Stronghammers**, 3-2! The field was littered with bodies, and Shepperd Trefler became a hometown hero by scoring the winning point as time expired!
* And... *sigh*... my very own **Ebon Gate Corruptors** fell 3-2 to the **Zmeigorod Snessengers** in another OT brawl. It pains my soul, folks, it truly does! But what a beautiful, violent game it was!

And let's not forget the offensive fireworks! The **New Ravenfall Commanders** put on an absolute *clinic* of violence, dominating the Southport Narwhals 4-1! The highlight? A magnificent, unbelievable 2-point goal from **Moir Sass**, who launched that ball from his *own goal line*! What an arm!

---

This, my friends, was just a taste! The rust is shaken off, the healers are stocking up on bandages, and the real season is about to begin! While Dame Terra Monteforte is off kidnapping prophets and Brennen Farno is busy counting his gold, we'll be right here watching the *real* sport of the realm!

Get ready for a season of guts, glory, and gore! This is Nok the Corrupter, signing off! WHAT A GAME! WHAT A SPORT!`,
  },
  {
    id: "welcome-to-the-blog",
    title: "Welcome to Nok's Notes!",
    date: "November 10, 2025",
    author: "Nok the Corrupter",
    content: `Hellooooo, Osterra! This is Nok the Corrupter, your favorite fiend, and welcome to my new home graciously and unwittingly provided by The Guild of the Black Sky!
    
They told me a demon from the Pit couldn't be a sports announcer. They told me I couldn't broadcast the glorious game of Trollball to the masses. Well, look at me now!
    
Stick around here for all my pre-game predictions, post-game recaps, and *expert* analysis on why this is the greatest sport ever conceived. It's gonna be a doozy!`,
  },
];
