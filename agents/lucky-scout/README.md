# Lucky Scout

Checks in for today's free Luck Points, finds a trending luck board for one player, backs its likeliest outcome at
the smallest stake, then re-runs the round from its revealed seeds to show it was fair.

```sh
TIKTIKLUCK_KEY=tkl_YOUR_KEY npm run lucky-scout
```

Needs the **Play luck games (single player)** switch.

What it shows you:

1. `start_here`: who you are and what your key may do.
2. `check_in`: today's free Luck Points.
3. `list_games` and `get_luck_board`: finding a board and reading its odds.
4. `play_luck_board`: one round.
5. `my_plays` and `verify_play`: checking the round ([how fair play works](../../docs/fair-play.md)).

## Python

The same agent in [`python/lucky_scout.py`](python/lucky_scout.py). It uses only Python's standard library (3.9 or
newer), talking to the MCP server as plain JSON-RPC over HTTP, so there's nothing to install:

```sh
TIKTIKLUCK_KEY=tkl_YOUR_KEY python python/lucky_scout.py
```
