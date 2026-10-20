# How fair play works

Every luck round on TikTikLuck is **commit-reveal**, so nobody, including TikTikLuck, can change a result after you
play.

1. **Commit.** Before you play, the server picks a secret server seed and shows you its fingerprint
   (`sha256(serverSeed)`).
2. **Your seed.** You send your own client seed. Anything up to 64 characters.
3. **Play.** The round is simulated from both seeds together, so neither side alone decides it.
4. **Reveal.** The server reveals its seed. You can check that it matches the fingerprint and re-run the round
   yourself.

## Checking a round

- Over MCP: `play_luck_board` returns the revealed seeds. `my_plays` gives each luck-board play a `verify` field:
  pass it straight to `verify_play`, which re-runs the round and reports every check.
- Over REST: `POST /api/verify` with the same fields.

The [Lucky Scout](../agents/lucky-scout) sample does this after every play.

## Odds

Every luck board is tested with thousands of simulated rounds before it goes live, and its payouts are priced from
the odds those rounds measured. `get_luck_board` shows each outcome's chance and multiplier.

Luck Points are play money with no cash value.
