import { TEAMS } from "./teams";
import { team } from "./types";
import { seededShuffle } from "./utils";

interface BaseMatch {
  homeTeam: team;
  awayTeam: team;
  week: number;
}

export function generateSeasonSchedule(
  teamRecord: Record<string, team>,
): BaseMatch[] {
  const schedule: BaseMatch[] = [];

  // Exclude "No Team" or check if it exists in the records
  const teamList = Object.values(teamRecord).filter(
    (t) => t && t.name && t.name !== "No Team",
  );

  const teamObjects = seededShuffle(teamList, "Season 1");

  let teams = [...teamObjects];
  const isOdd = teams.length % 2 !== 0;
  if (isOdd) {
    teams.push({
      name: "BYE",
      slug: "bye",
    } as unknown as team);
  }

  const numTeams = teams.length;
  const numWeeks = numTeams - 1;
  const gamesPerWeek = numTeams / 2;

  // Keep the first team fixed and rotate the rest
  const rotatingTeams = teams.slice(1);

  for (let week = 0; week < numWeeks; week++) {
    const team1 = teams[0];
    const team2 = rotatingTeams[0];

    // --- Game 1 (The fixed team's game) ---
    // We alternate home/away for the fixed team
    schedule.push({
      homeTeam: week % 2 === 0 ? team1 : team2,
      awayTeam: week % 2 === 0 ? team2 : team1,
      week: week,
    });

    // --- Other Games ---
    // Pair the remaining teams from the rotating list
    for (let i = 1; i < gamesPerWeek; i++) {
      const home = rotatingTeams[i];
      const away = rotatingTeams[rotatingTeams.length - i];

      schedule.push({
        homeTeam: home,
        awayTeam: away,
        week: week,
      });
    }

    // --- Rotate ---
    // Move the last team in the rotating list to the front
    const lastTeam = rotatingTeams.pop();

    if (lastTeam) {
      rotatingTeams.unshift(lastTeam);
    }
  }

  return schedule;
}

export const STATIC_LEAGUE_SCHEDULE: BaseMatch[] =
  generateSeasonSchedule(TEAMS);
