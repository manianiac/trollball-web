import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor,
} from "@heroui/table";
import React from "react";

import DefaultLayout from "@/layouts/default";
import { TeamIcon } from "@/components/icons";
import { match, TEAM_NAMES } from "@/utils/types";
import { GAMES } from "@/utils/games.generated";

interface TeamStats {
  rank: number;
  teamName: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDiff: number;
}

/**
 * Calculates the league standings based on an array of completed games.
 */
function calculateStandings(games: match[]): TeamStats[] {
  const statsMap = new Map<string, TeamStats>();

  // 1. Initialize stats for all known teams (optional, but ensures 0-0 teams show up)
  // If you want only teams that have played to show up, skip this loop.
  Object.values(TEAM_NAMES).forEach((name) => {
    if (name === TEAM_NAMES["No Team"]) return;
    statsMap.set(name, {
      rank: 0,
      teamName: name,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointDiff: 0,
    });
  });

  // 2. Process each game
  games.forEach((game) => {
    // Ensure teams exist in map (in case we didn't initialize all of them)
    if (!statsMap.has(game.homeTeam.name)) {
      statsMap.set(game.homeTeam.name, {
        rank: 0,
        teamName: game.homeTeam.name,
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        pointDiff: 0,
      });
    }
    if (!statsMap.has(game.awayTeam.name)) {
      statsMap.set(game.awayTeam.name, {
        rank: 0,
        teamName: game.awayTeam.name,
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        pointDiff: 0,
      });
    }

    const homeStats = statsMap.get(game.homeTeam.name)!;
    const awayStats = statsMap.get(game.awayTeam.name)!;

    // Update Points
    homeStats.pointsFor += game.homeScore;
    homeStats.pointsAgainst += game.awayScore;
    awayStats.pointsFor += game.awayScore;
    awayStats.pointsAgainst += game.homeScore;

    // Update Wins/Losses
    if (game.homeScore > game.awayScore) {
      homeStats.wins += 1;
      awayStats.losses += 1;
    } else if (game.awayScore > game.homeScore) {
      awayStats.wins += 1;
      homeStats.losses += 1;
    } else {
      // Handle draws if your game logic allows them (current logic prevents draws)
      // homeStats.draws += 1;
      // awayStats.draws += 1;
    }
  });

  // 3. Calculate Differentials and Sort
  const standings = Array.from(statsMap.values()).map((stat) => ({
    ...stat,
    pointDiff: stat.pointsFor - stat.pointsAgainst,
  }));

  standings.sort((a, b) => {
    // Primary sort: Wins (descending)
    if (b.wins !== a.wins) return b.wins - a.wins;
    // Secondary sort: Point Differential (descending)
    if (b.pointDiff !== a.pointDiff) return b.pointDiff - a.pointDiff;

    // Tertiary sort: Points For (descending)
    return b.pointsFor - a.pointsFor;
  });

  // 4. Assign Ranks
  standings.forEach((stat, index) => {
    stat.rank = index + 1;
  });

  return standings;
}

export default function TeamsPage() {
  // Calculate standings from the imported GAMES array
  // We wrap this in useMemo so it doesn't recalculate on every render
  const initialStandings = React.useMemo(() => calculateStandings(GAMES), []);

  // State for sorting
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "rank",
    direction: "ascending",
  });

  // Helper to sort the data based on the current descriptor
  const sortedStandings = React.useMemo(() => {
    return [...initialStandings].sort((a: TeamStats, b: TeamStats) => {
      let first = a[sortDescriptor.column as keyof TeamStats];
      let second = b[sortDescriptor.column as keyof TeamStats];

      // Ignore "The " prefix when sorting by team name
      if (sortDescriptor.column === "teamName") {
        first = (first as string).replace(/^The\s+/i, "");
        second = (second as string).replace(/^The\s+/i, "");
      }
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, initialStandings]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-6 p-4 md:p-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            League Standings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            The race for the Trollball Cup
          </p>
        </div>

        <Table
          isStriped
          aria-label="Trollball League Standings"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader>
            <TableColumn key="rank" allowsSorting>
              RANK
            </TableColumn>
            <TableColumn key="teamName" allowsSorting>
              TEAM
            </TableColumn>
            <TableColumn key="wins" allowsSorting align="center">
              W
            </TableColumn>
            <TableColumn
              key="losses"
              allowsSorting
              align="center"
              className="hidden md:table-cell"
            >
              L
            </TableColumn>
            <TableColumn
              key="pointsFor"
              allowsSorting
              align="center"
              className="hidden md:table-cell"
            >
              PF
            </TableColumn>
            <TableColumn
              key="pointsAgainst"
              allowsSorting
              align="center"
              className="hidden md:table-cell"
            >
              PA
            </TableColumn>
            <TableColumn key="pointDiff" allowsSorting align="center">
              DIFF
            </TableColumn>
          </TableHeader>
          <TableBody>
            {sortedStandings.map((team) => (
              <TableRow key={team.teamName}>
                <TableCell>
                  <span className="font-bold text-lg text-default-500">
                    {team.rank}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <TeamIcon size={32} team={team.teamName} />
                    <span className="font-semibold text-medium">
                      {team.teamName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-bold text-lg">
                  {team.wins}
                </TableCell>
                <TableCell className="text-center text-lg text-default-500 hidden md:table-cell">
                  {team.losses}
                </TableCell>
                <TableCell className="text-center hidden md:table-cell">
                  {team.pointsFor}
                </TableCell>
                <TableCell className="text-center text-default-400 hidden md:table-cell">
                  {team.pointsAgainst}
                </TableCell>
                <TableCell
                  className={`text-center font-bold ${team.pointDiff > 0
                      ? "text-success"
                      : team.pointDiff < 0
                        ? "text-danger"
                        : "text-default-400"
                    }`}
                >
                  {team.pointDiff > 0 ? "+" : ""}
                  {team.pointDiff}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </DefaultLayout>
  );
}
