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
    id: "week-1-recap-season-opener",
    title:
      "WEEK 1 RECAP: OVERTIME THRILLERS, SHOCKING SHUTOUTS, AND BEAUTIFUL BRUTALITY!",
    date: "November 18, 2025",
    author: "Nok the Corrupter",
    content:
      "# 🎙️ TUESDAY NIGHT TROLLBALL IS BACK ON THE AIR! 🎙️\n\nHelloooooo sports fans, bone-breakers, and blood-letters! This is your favorite fiend, **Nok the Corrupter**, coming to you LIVE from the ethereal airwaves! Can you believe it? After that little stint in the Demon Prison—thanks again to **God King Sir Artorias** and his band of merry murderers for the jailbreak, I suppose—we are back for another season of the greatest sport in all of Osterra!\n\nWeek 1 is in the books, and by the twisted horns of **Lord Orzalon**, what a week it was! We had everything: mud, blood, tears, and enough concussions to make a Healer retire early. Let's dive right into the carnage!\n\n---\n\n## ⏱️ WORKING OVERTIME: THE NAIL-BITERS\n\nFolks, you couldn't ask for a better start to the season than TWO games going into sudden-death Overtime! The drama! The suspense! The exhaustion!\n\n### 💰 The New Prosperity Profits (3) def. The Greenwatch (2) [OT]\nDown at **The Guilder's Field**, the money-men hosted **Sir Randy's** little nature club. It was a back-and-forth slugfest! The Profits tied it up late thanks to a beautiful shot by **Abramson Doxia**, sending us into extra time. And who was the hero? **Yoshi Cathy**! The same maniac whose pre-game ritual involves eating a RAW ONION layer by layer! He tore through the Greenwatch defense with tears in his eyes—probably from the onions—to score the winning Touchdown! **Chairman Farno** must be thrilled; nothing sells tickets like a photo finish!\n\n### ⚔️ The Kerlauger Runeguard (3) def. The New Monteforte Chaos Creatures (2) [OT]\nOver in the **Unruly Yard**, **Dame Terra Monteforte's** Chaos Creatures lived up to their name, but they couldn't close the deal! It was a brutal affair with knockouts left and right—**Lashondra Niehaus** and **Mouldon Earl** decided to take a synchronized nap on the turf! In the end, it was **Johnna Beetner** of the Runeguard who tucked the ball away and dove into the endzone for the win! Sorry, Terra, maybe kidnap a better defensive coordinator next time?\n\n---\n\n## 🛑 THE ZERO HEROES: SHUTOUT CENTRAL\n\nWe had some defenses playing like brick walls this week! If you like watching teams fail to score, oh boy, do I have news for you!\n\n### 🐋 The Southport Narwhals (4) def. The Tortell Privateers (0)\nA COMPLETE WASHOUT at the **Buccaneer's Bowl**! The Narwhals came down from the north—courtesy of **King Nezmear's** domain—and absolutely embarrassed the resort crowd. **Blood Eppes** and **Fineman Dolhenty** ran circles around the Privateers. It was 4-0! A total domination! I hope **Elspeth Ortell** has a disintegration spell ready for that playbook, because yikes!\n\n### ❄️ The South Pole Yetis (2) def. Oak & Onslaught (0)\nIn the battle of the wilderness, the frozen frontier beat the curated forest! **Sayers Erdda** launched a beauty of a kick to put the Yetis on top, and their defense held strong against the Wardens' squad. **Seiter Aida**, the Yetis' healer, was smelling their own socks for luck, and apparently, the stench of victory is pungent!\n\n### 🏰 The New Ravenfall Commanders (2) def. The Confluence Captains (0)\n**Sir Tanos's** favorites walked into the Glowstone Terrace and shut the lights out! **Dusa Curson** was the MVP here, dodging tackles and sinking a 2-point shot while **Fleme Alis** was busy knocking out half the opposing team. **Cyfnerth the Butcher** would have loved the recycling of bodies in this one!\n\n---\n\n## 😈 NOK'S CORNER: THE GOOD, THE BAD, AND THE UGLY\n\n### 💔 Heartbreak at the Sinking Field\n**The Zmeigorod Snessengers (2) def. The Ebon Gate Corruptors (0)**\nLook, I'm a professional. I am unbiased. BUT COME ON! My beloved Corruptors hosted those swamp-dwellers and couldn't put a single point on the board? **As Utter** was out there flattening people with a Greatsword—which was beautiful to behold, truly—but you can't win if you don't score! **Valos the Eternal** is probably laughing in her bog right now. Disgusting.\n\n### 🤣 COMEDY OF THE WEEK\n**The Wyrmwood Stronghammers (1) def. The Haven Lights (0)**\nHAHA! Oh, this warms my cold, dead heart. The **Haven Lights**, playing on their precious \"Hallowed Ground\" under the watchful eye of the Temple, GOOSE-EGGED! **Riffle Heyde** fumbled the ball, **Sondra Elaina** ran wild for Wyrmwood, and the \"heroes\" of Haven go home crying! **Autumn Jodoin** chugged raw eggs for breakfast and ate the Lights for lunch! A glorious day for villains everywhere!\n\n---\n\n## 🏔️ HIGH ALTITUDE HIJINKS\n\n**The Oread's Summit Tamers (4) def. The Starlight Bazaar Bizarres (2)**\nUp in the thin air, we saw the highest-scoring game of the week! **Alwyn Wandy** was an absolute monster for the Tamers, stripping the ball, scoring points, and recovering fumbles! The **Prismatic Troupe's** flashy distractions didn't work up in the mountains. **Kython** might run a fun circus, but the Tamers run the pitch!\n\n---\n\n## 🤕 INJURY REPORT\n\nToo many to count, folks! We had self-inflicted knockouts (looking at you, **Rese Halpern** of Greenwatch), double-KOs, and more concussions than **Chairman Toland** has blocks of cheese! The Healers are working overtime, and the blood on the pitch is fresh! \n\nThat's it for Week 1! Tune in next Tuesday for more mayhem, more violence, and more TROLLBALL! This is **Nok the Corrupter**, signing off! Keep your shields up and your heads down! 🩸🏈",
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
