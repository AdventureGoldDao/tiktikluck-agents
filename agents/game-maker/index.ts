/**
 * Game Maker: turns one sentence into a luck board, publishes it, and reports how your games are doing.
 *
 *   TIKTIKLUCK_KEY=tkl_… npm run game-maker -- "five marbles race down a spiral"
 *
 * Needs the "Create luck games" switch. Publishes one game, then stops. People will be able to play it.
 */
import { connect, lp, requireSwitch } from "../lib/tiktikluck.js";

const idea = process.argv.slice(2).join(" ").trim();
if (idea.length < 3) {
  console.error('Describe your game, for example: npm run game-maker -- "five marbles race down a spiral"');
  process.exit(1);
}

const tools = await connect();
await requireSwitch(tools, "Create luck games");

// 1. The AI designs a board from the sentence. Nothing is published yet.
const design = await tools.call<{ config: { cosmetic?: { name?: string } } & Record<string, unknown>; notes: string[] }>("design_luck_board", { prompt: idea });
console.log(`Designed "${design.config.cosmetic?.name ?? "your board"}".`);

// 2. Publish it. TikTikLuck tests it with thousands of rounds to price its odds before it goes live.
let pub = await tools.call<{ configHash: string; status: string; why?: string[]; sharePath: string }>("publish_luck_board", { config: design.config });
for (let i = 0; pub.status === "certifying" && i < 12; i++) {
  await new Promise((r) => setTimeout(r, 5000));
  pub = { ...pub, ...(await tools.call("game_status", { configHash: pub.configHash })) };
}
if (pub.status !== "live") {
  console.log(`Not live (${pub.status}).`, ...(pub.why ?? []));
} else {
  const origin = new URL(process.env.TIKTIKLUCK_URL ?? "https://www.tiktikluck.com/mcp").origin;
  console.log(`Live! Share it: ${origin}${pub.sharePath}`);
}

// 3. How your games are doing so far.
const mine = await tools.call<{ earnedLp: number; luckBoards: { name: string; status: string; plays: number }[] }>("my_games");
for (const g of mine.luckBoards.slice(0, 5)) console.log(`- ${g.name} (${g.status}): ${g.plays} plays`);
console.log(`Luck Points from your games so far: ${lp(mine.earnedLp ?? 0)}.`);

await tools.close();
