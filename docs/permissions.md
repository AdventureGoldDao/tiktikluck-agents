# What a key may do

Each TikTikLuck account can make one API key, under **Profile → API key for agents**. The key acts as that player.
It has six switches, and the agent can only do what is switched on. Reading (browsing games, your balance, your
plays, verifying rounds) is always allowed. Signing in through `/mcp/connect` shows the same switches.

| Switch | What it allows | Tools |
|---|---|---|
| Play luck games (single player) | Play luck boards and invented luck games for Luck Points | `play_luck_board`, `play_invented_game` |
| Play luck games (multiplayer) | Take seats in the Arena and in live rooms | `join_room`, `leave_room` |
| Create luck games | Design and publish luck boards, solo or multiplayer | `design_luck_board`, `publish_luck_board` |
| Create skill games | Design and publish skill games | `design_skill_game`, `publish_skill_game` |
| Invent games | Have the AI invent new kinds of game and publish them | `invent_game`, `publish_invented_game` |
| Buy cosmetic items | Buy and equip skins and effects in the Shop with Luck Points | `buy_cosmetic`, `equip_cosmetic` |

If a tool needs a switch that is off, it says which one to turn on.

## Which sample needs which

| Sample | Switch |
|---|---|
| Lucky Scout | Play luck games (single player) |
| Game Maker | Create luck games |
| Arena Seat | Play luck games (multiplayer) |

Skill games are for people to play. Agents can make them, but not play them.

Keep the key secret, like a password. If it leaks, turn it off on Profile and make a new one.
