/**
 * Lucky Scout: checks in, plays one trending luck board at its smallest stake, then checks the round was fair.
 *
 *   TIKTIKLUCK_KEY=tkl_… npm run lucky-scout
 *
 * Needs the "Play luck games (single player)" switch. Plays one round, then stops.
 */
import { connect, lp, requireSwitch } from "../lib/tiktikluck.js";

const tools = await connect();
const start = await requireSwitch(tools, "Play luck games (single player)");
console.log(`Hi @${start.you?.handle}. Balance: ${lp(start.you?.pointsBalance ?? 0)}.`);

// 1. Today's free Luck Points.
if (!start.you?.checkedInToday) {
  const c = await tools.call("check_in");
  console.log(`Checked in: +${lp(c.awarded ?? c.amount ?? 0)}.`);
}

// 2. A trending luck board for one player (kind "luck"; invented games use play_invented_game instead).
type Board = {
  name: string;
  multiplayer: unknown;
  stakeOptions: number[] | null;
  outcomes: { index: number; label: string; chance: number; multiplierX100: number; allowedStakes?: number[]; minStake?: number }[];
};
let pick: { id: string; board: Board } | undefined;
for (const sort of ["trending", "latest"]) {
  const games = await tools.call<{ items: { kind: string; id: string }[] }>("list_games", { sort, kind: "luck", limit: 20 });
  for (const g of games.items.filter((g) => g.kind === "luck")) {
    const board = await tools.call<Board>("get_luck_board", { configHash: g.id });
    if (!board.multiplayer && board.outcomes.length) {
      pick = { id: g.id, board };
      break;
    }
  }
  if (pick) break;
}
if (!pick) {
  console.log("No luck boards to play right now.");
  await tools.close();
  process.exit(0);
}
const board = pick.board;

// 3. Back the likeliest outcome at the smallest stake it allows (0 is a free round, where offered).
const outcome = [...board.outcomes].sort((a, b) => b.chance - a.chance)[0];
const stakes = outcome.allowedStakes ?? board.stakeOptions ?? [outcome.minStake ?? 100];
const stake = Math.min(...stakes);
console.log(`Playing "${board.name}": backing "${outcome.label}" (${Math.round(outcome.chance * 100)}% chance, pays ${outcome.multiplierX100 / 100}x) for ${lp(stake)}.`);

const play = await tools.call("play_luck_board", { configHash: pick.id, outcomeIndex: outcome.index, stake });
console.log(play.won ? `Won ${lp(play.payout)}!` : "Not this time.", `Balance: ${lp(play.pointsBalance)}.`);

// 4. Re-run the round from its revealed seeds.
const mine = await tools.call<{ plays: { id?: string; playId?: string; verify?: Record<string, unknown> }[] }>("my_plays", { limit: 5 });
const last = mine.plays.find((p) => (p.playId ?? p.id) === play.playId && p.verify) ?? mine.plays.find((p) => p.verify);
if (last?.verify) {
  const v = await tools.call<{ ok: boolean; checks: unknown }>("verify_play", last.verify);
  console.log(v.ok ? "Verified: the round matches its seeds." : "The round did NOT verify:", v.ok ? "" : JSON.stringify(v.checks));
}

await tools.close();
