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
    id: "preseason-week-one-recap",
    title:
      "PRE-SEASON RECAP: A Glorious Week of Shutouts, Slugfests, and Spectacular Scores!",
    date: "November 18, 2025",
    author: "Nok the Corrupter",
    content:
      "Helloooooo Trollball fanatics, and welcome back! This is your favorite fiend, Nok the Corrupter, with a look back at a truly spectacular opening week of pre-season action! The rust has been knocked off, the bodies have been bruised, and the stage is set for a season of pure, unadulterated mayhem! From dominant defensive stands to last-second thrillers, this week had it all! Let's get to the good stuff!\n\n## The Wall of Silence! A Symphony of Shutouts! 🧱\n\nMy goodness, folks, what a week for defense! We saw not one, not two, but FIVE teams completely shut out their opponents! That’s right, a big fat ZERO on the scoreboard! It was a beautiful sight to behold!\n\nThe Desert Spectres started things off with a clinical 2-0 dismantling of The Brimstone Fire Eaters. Perhaps the Fire Eaters' patron, Sir Tanos, was too busy polishing that cursed sword of his to give them a proper pep talk. A real shame!\n\nThen we had the Wardens of Oak & Onslaught putting on a 3-0 clinic against The South Pole Yetis. Wynnie Faina's two-point shot to seal the deal was a thing of beauty! It just goes to show you, a solid game plan beats a fancy bow any day of the week, doesn't it, Sir Randy?\n\nWe also witnessed The Kerlauger Runeguard and The New Prosperity Profits pitch shutouts, winning 2-0 apiece! But the real nail-biter was the Oread's Summit Tamers' 1-0 victory over The Starlight Bazaar Bizarres! That game ended with one of the most incredible runs I have ever seen from Milo Nelie, who weaved through four defenders only to be stopped by the final whistle! Heartbreak for the Bizarres, but what a spectacular finish!\n\n## Down to the Wire! The One-Point Wonders! 💥\n\nIf shutouts aren't your style, don't you worry! We had a whole slate of games that went right down to the final, frantic moments! And what a collection of classics they were!\n\nFirst, and most importantly, let's talk about the greatest team in the league, your **EBON GATE CORRUPTORS**! They snatched a 4-3 victory from the jaws of defeat against the Zmeigorod Snessengers! After falling behind, it was Ahasuerus An who launched a two-point miracle to retake the lead! That's grit! That's power! That's Corruptors Trollball, and it brought a tear to my eye!\n\nAnd speaking of tears, how about those Wyrmwood Stronghammers marching onto the painfully pristine Aegis Field and handing my least favorite team, The Haven Lights, a 3-2 loss! Oh, it was glorious! Godart Urissa was an absolute one-person wrecking crew, scoring all three points for the Stronghammers! It seems that 'Hallowed Ground' doesn't protect you from a good old-fashioned beatdown!\n\nWe also saw The Confluence Captains squeak out a 4-3 win in a high-scoring brawl against the New Ravenfall Commanders, and The Tortell Privateers defended their resort with a 2-1 victory over the Southport Narwhals! What a week for close calls and crushed hopes!\n\n## Highlights and High Fists! The Best of the Brawls! 👊\n\nAcross the league, the action was non-stop! The theme of the week had to be the Double Knockout! We saw them everywhere! Players from every team showing that beautiful, mutual respect by hitting each other so hard they both had to take a little nap. It was a symphony of symmetrical violence!\n\nWe saw players knock out their *own* teammates, long-bomb shots from Center Field, and goal-line stands that were simply magnificent. This pre-season has proven that every single team is hungry, and they're willing to trade a few teeth for a taste of victory!\n\nWhat a week, folks! What a start to the season! The players are already in mid-season form when it comes to bruising and brawling, and I, for one, could not be happier! This is Nok the Corrupter, signing off and reminding you to always enjoy the carnage! 🏆",
  },
  {
    id: "welcome-to-the-blog",
    title: "Welcome to Nok's Notes!",
    date: "November 17, 2025",
    author: "Nok the Corrupter",
    content: `Hellooooo, Osterra! This is Nok the Corrupter, your favorite fiend, and welcome to my new home graciously and unwittingly provided by The Guild of the Black Sky!
    
They told me a demon from the Pit couldn't be a sports announcer. They told me I couldn't broadcast the glorious game of Trollball to the masses. Well, look at me now!
    
Stick around here for all my pre-game predictions, post-game recaps, and *expert* analysis on why this is the greatest sport ever conceived. It's gonna be a doozy!`,
  },
];
