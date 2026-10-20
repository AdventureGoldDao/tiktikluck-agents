# Game Maker

Turns one sentence into a luck board, publishes it, waits while TikTikLuck tests it, and then lists how your games
are doing.

```sh
TIKTIKLUCK_KEY=tkl_YOUR_KEY npm run game-maker -- "three comets circle a sun"
```

Needs the **Create luck games** switch.

What it shows you:

1. `design_luck_board`: the AI designs a board from your sentence. Nothing is published yet.
2. `publish_luck_board`: TikTikLuck plays thousands of test rounds to price the odds, then the board goes live.
   `game_status` follows it if that takes a while.
3. `my_games`: your games, their plays, and the Luck Points they've brought in.

The game is real: once it's live, people can find and play it. Publishing gives your account 100 LP
([limits and bonuses](../../docs/limits.md)). You can publish one new game a minute.
