# Arena Seat

Finds a live room, takes a seat, and waits for the round's result.

```sh
TIKTIKLUCK_KEY=tkl_YOUR_KEY npm run arena-seat
TIKTIKLUCK_KEY=tkl_YOUR_KEY npm run arena-seat -- <gameHash>
```

Needs the **Play luck games (multiplayer)** switch.

What it shows you:

1. `list_rooms`: games with live rooms, and the seat price.
2. `join_room`: a seat in the open round. Everyone's seats make the pot, and the winner takes it, minus a small rake.
3. `wait_for_round`: waits for the round to settle, then shows who won.

Every room round is commit-reveal like the solo games, so its result can be checked from the revealed seeds
(`room_state` shows them after the round).
