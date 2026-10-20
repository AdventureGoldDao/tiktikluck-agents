/**
 * Arena Seat: takes a seat in a live room and waits for the round's result.
 *
 *   TIKTIKLUCK_KEY=tkl_… npm run arena-seat
 *   TIKTIKLUCK_KEY=tkl_… npm run arena-seat -- <gameHash>     (a particular room)
 *
 * Needs the "Play luck games (multiplayer)" switch. Takes one seat, then stops.
 */
import { connect, lp, requireSwitch } from "../lib/tiktikluck.js";

const tools = await connect();
await requireSwitch(tools, "Play luck games (multiplayer)");

// 1. Pick a room: the one asked for, else the one with the most people waiting, else the Arena.
const rooms = await tools.call<{ seatStakeLp: number; rooms: { gameHash: string; name: string; players?: number; maxPlayers?: number; seated?: number }[] }>("list_rooms");
const asked = process.argv[2];
const open = rooms.rooms.filter((r) => r.gameHash !== "arena" && (r.seated ?? 0) < (r.maxPlayers ?? Infinity));
const room = (asked && rooms.rooms.find((r) => r.gameHash === asked)) || open.sort((a, b) => (b.seated ?? 0) - (a.seated ?? 0))[0] || rooms.rooms[0];
console.log(`Taking a seat in "${room.name}" for ${lp(rooms.seatStakeLp)}.`);

// 2. Sit down. The pot goes to the winner, minus a small rake.
const seat = await tools.call<{ seatId: string; roundId: string; seats: number; pot: number }>("join_room", { game: room.gameHash });
console.log(`Seated in round ${seat.roundId}: ${seat.seats} seated, pot ${lp(seat.pot ?? 0)}.`);

// 3. Wait for the result (each call waits up to 45 s).
type Round = { roundId: string; phase: string; winnerSeatId?: string | null; payout?: number; seats?: { seatId: string; handle: string }[] };
let state: Round | undefined;
for (let i = 0; i < 8; i++) {
  state = await tools.call<Round>("wait_for_round", { game: room.gameHash });
  if (state.roundId !== seat.roundId || ["settled", "void", "cancelled"].includes(state.phase)) break;
}
if (state?.roundId === seat.roundId && state.phase === "settled") {
  const winner = state.seats?.find((s) => s.seatId === state.winnerSeatId);
  console.log(state.winnerSeatId === seat.seatId ? `You won the pot: ${lp(state.payout ?? 0)}!` : `@${winner?.handle ?? "someone"} won the pot (${lp(state.payout ?? 0)}).`);
} else {
  console.log(`The round ended as "${state?.phase}". Check room_state or my_plays for the result.`);
}

await tools.close();
