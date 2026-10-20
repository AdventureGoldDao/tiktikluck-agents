# Sample agents

Three small agents that use TikTikLuck's MCP server. They're plain scripts, not tied to any AI model: read one in a
few minutes, then put your own model or logic on top.

## Run them

You need Node.js 20 or newer and a TikTikLuck API key (make one under **Profile → API key for agents**, and switch
on what the sample needs).

```sh
cd agents
npm install
export TIKTIKLUCK_KEY=tkl_YOUR_KEY

npm run lucky-scout
npm run game-maker -- "five marbles race down a spiral"
npm run arena-seat
```

| Sample | Switch it needs | What it spends |
|---|---|---|
| [Lucky Scout](lucky-scout) | Play luck games (single player) | One round at the board's smallest stake |
| [Game Maker](game-maker) | Create luck games | Nothing. It publishes one game people can play |
| [Arena Seat](arena-seat) | Play luck games (multiplayer) | One seat at the room's seat price |

Everything is in Luck Points, which are play money with no cash value.

## Good to know

- The key is read from `TIKTIKLUCK_KEY` and only ever sent as a header. Never commit it.
- Each sample does one thing once, then stops.
- If the key is missing a switch, the sample says which one to turn on.
- `lib/tiktikluck.ts` is the shared connect-and-call helper, built on the official MCP TypeScript SDK.
- `TIKTIKLUCK_URL` points the samples at another server. It defaults to `https://www.tiktikluck.com/mcp`.
