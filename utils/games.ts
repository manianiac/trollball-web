import { match } from "./consts";
import { TEAMS } from "./teams";

export const GAMES: match[] = [
  {
    homeTeam: TEAMS["The New Ravenfall Commanders"],
    awayTeam: TEAMS["The New Monteforte Chaos Creatures"],
    preGame:
      '"Hello again, all you delightful degenerates! This is Nok the Corrupter, your one and only fiend-on-the-field, broadcasting live from the magnificent **Stronghold Bailey** here in New Ravenfall!\n\nAnd what a venue it is, folks! We are packed into the central bailey of Stronghold Castle itself, with fans hanging from the ramparts and a beautiful pitch of packed earth and cobblestone. Oh, I bet old Sir Tanos is just *fuming* that we’re having this much fun in his big, serious fortress. It’s beautiful!\n\nToday, we have a glorious matchup for you! Your very own **New Ravenfall Commanders** are taking the home field, and they look ready. I saw their healer, Hooge Imtiaz, leading them in one of those synchronized chants that just gets louder and louder. It’s giving me chills!\n\nAnd in the away corner, all the way from New Monteforte, it’s **The New Monteforte Chaos Creatures**! And let me tell you, they are living up to the name. Their healer, Lian Denton, was just seen chugging a shot of *hot gravy* from a dented cup. Now *that’s* a pre-game ritual! That’s more spirit than Dame Terra has in her entire library. I also heard Wolbrom Ariella singing a sea shanty, completely out of tune. It’s magnificent!\n\nThe whistle is about to blow, folks. It’s the Commanders vs. the Chaos Creatures, right here in the heart of the castle. This is going to be a glorious, messy, wonderful brawl. Don’t you go anywhere!"',
    postGame:
      "And that’s the game! Hold onto your helmets, folks, because your New Ravenfall Commanders have done it! They’ve defended their home turf and pulled out the win in a nail-biter, **1 to 0** over the New Monteforte Chaos Creatures!\n\nWhat a game! This was a defensive slugfest from the word 'go.' We saw players trading blows all afternoon. Fogel Raynold was out there knocking players down with his Horseman's Pick. And my goodness, what a run from Wolbrom Ariella of the Chaos Creatures in the first half! Ariella just *blew* through the line for a two-zone run, first past Dusa Curson and then Croteau Osmo. It was a spectacular effort, the kind of charge Colm the Warrior *wishes* he could pull off, but the Commanders' defense shut it down before they could score.\n\nIt was zero-zero at the half, and it all came down to one beautiful, shining moment!\n\nIt started in the second half, with the Commanders on the offensive. **Rhett Gavrilla** got the ball in the Home 2-Point zone and launched a perfect pass... right into the hands of **Jessalin Zobias**! Zobias made the catch, advanced a zone, saw the opening, and just *went for it*! Urata Oriana of the Chaos Creatures made a desperate dive for the block, but Zobias was too quick! A beautiful, magnificent score!\n\That was all they needed! The Chaos Creatures fought like mad to the very end—Jozef Pepe was still knocking players out right up to the last whistle—but the Commanders held the line.\n\nA 1-0 victory for the home team! You see that, Sir Artorias? *That’s* how you win a battle—with teamwork, grit, and a perfectly thrown troll head.\n\nWhat a day for Trollball! This has been Nok the Corrupter, signing off live from the Stronghold Bailey. Now, go cause some trouble!\"",
    date: 0,
    homeScore: 1,
    awayScore: 0,
    slug:
      TEAMS["The New Ravenfall Commanders"].slug +
      "-" +
      TEAMS["The New Monteforte Chaos Creatures"].slug +
      "-" +
      0,
  },
  {
    homeTeam: TEAMS["The South Pole Yetis"],
    awayTeam: TEAMS["The Confluence Captains"],
    preGame:
      "(Static crackles, followed by the distant sound of howling wolves)\n\n\"Helloooo, Osterra, and welcome back to the only sport that matters! This is Nok the Corrupter, your favorite fiend, broadcasting live... and let me tell you, I mean *live*... from **The South Pole Palisade**!\n\nAnd folks, what a venue! It’s less a stadium and more a stockade to keep the wilderness out. The pitch is frozen mud and straw, there's a lovely bit of freezing rain coming down, and the local wolf pack is singing the song of their people! It is *glorious*!\n\nOur home team, **The South Pole Yetis**, look completely unfazed by the cold. Their healer, Seiter Aida, was just seen getting ready by... uh... smelling their own game-worn socks from the last match. That’s a level of commitment you just don't see in civilized lands! \n\nAnd in the visiting corner, **The Confluence Captains** are a long, long way from their fancy, polished 'Glowstone Terrace' back home. Can they handle the mud? Well, I'm not sure, but I *did* see Ladew Evelina chug a raw egg—shell and all—and their healer Kant Langill is doing a very clumsy dance to keep warm. They might just be weird enough to thrive here!\n\nThe whistle is about to blow! It's the city slickers versus the survivalists! This is going to be a messy one, folks, and I cannot wait!\"",
    postGame:
      "(The roar of a small, bundled-up crowd and a final, sharp whistle blast)\n\n\"And that's the game! The Confluence Captains have done it! They marched into the frozen wastes and took the win from the home team, with a final score of **5 to 2**!\n\nWhat a game, folks! It was a real back-and-forth brawl out there on the ice! The Yetis looked strong when **Duky Orelee** landed a beautiful 2-point shot from Home Field, sending the local crowd into a frenzy!\n\nBut the Captains, led by **Ladew Evelina**, answered right back after the half with a 2-pointer of their own! And then—oh, my friends, you should have seen it—**Stephan Lisk**! From *Center Field*! Lisk just wound up and launched the troll head from the dead center of the pitch for 2 points! I haven't seen a throw like that all season! \n\n**O'Conner Maighdlin** added one more goal for the Captains to seal the deal. A tough loss for the Yetis at home, but what a spectacular offensive showing from The Confluence Captains! \n\nThis has been Nok the Corrupter, signing off from the South Pole Palisade. My horns are frozen solid, but my heart is warm with the love of the game. Now, go cause some trouble!\"",
    date: 0,
    homeScore: 2,
    awayScore: 5,
    slug: "south-pole-confluence-0",
  },
];
