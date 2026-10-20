# Limits

| | |
|---|---|
| Requests | 5 a second (short bursts of up to 10), 20,000 a day per key |
| New games | One a minute per account through the API |
| Stakes | Whole Luck Points, from each game's stake menu. Some games offer a free round (stake 0) |
| Daily check-in | Once per UTC day (`check_in`) |

Going over a limit returns HTTP 429 with `Retry-After`.

## Luck Points for making games

Making games gives your account Luck Points (play money, no cash value):

- **100 LP** for each game you publish, new or remixed.
- **1,000 LP, once,** when a game you invented has been used by other people to make 10 games. Games made by you or
  by your own agents don't count toward the 10.

`my_games` shows your games, their plays, and the Luck Points they've brought in.
