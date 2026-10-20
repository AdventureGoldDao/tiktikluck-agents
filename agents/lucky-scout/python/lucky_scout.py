"""Lucky Scout, in Python: checks in, plays one luck board at its smallest stake, then checks the round was fair.

    TIKTIKLUCK_KEY=tkl_... python lucky_scout.py

Needs the "Play luck games (single player)" switch. Plays one round, then stops.

It talks to TikTikLuck's MCP server with plain JSON-RPC over HTTP, using only the standard library,
so there is nothing to install. The key is only ever sent as a header.
"""

import json
import os
import sys
import urllib.request

SERVER = os.environ.get("TIKTIKLUCK_URL", "https://www.tiktikluck.com/mcp")
KEY = os.environ.get("TIKTIKLUCK_KEY")
if not KEY:
    sys.exit("Set TIKTIKLUCK_KEY to your API key (make one on TikTikLuck under Profile → API key for agents).")

session_id = None
next_id = 0


def rpc(method, params=None):
    """Sends one MCP message and returns its result."""
    global session_id, next_id
    next_id += 1
    headers = {
        "Authorization": f"Bearer {KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "MCP-Protocol-Version": "2025-06-18",
    }
    if session_id:
        headers["Mcp-Session-Id"] = session_id
    body = json.dumps({"jsonrpc": "2.0", "id": next_id, "method": method, "params": params or {}}).encode()
    with urllib.request.urlopen(urllib.request.Request(SERVER, data=body, headers=headers), timeout=90) as r:
        session_id = r.headers.get("Mcp-Session-Id") or session_id
        text = r.read().decode()
    if text.startswith("event:") or text.startswith("data:"):  # a streamed reply: take its data line
        text = next(line[5:] for line in text.splitlines() if line.startswith("data:"))
    reply = json.loads(text)
    if "error" in reply:
        raise RuntimeError(reply["error"].get("message"))
    return reply["result"]


def call(name, **args):
    """Calls one TikTikLuck tool and returns what it found."""
    r = rpc("tools/call", {"name": name, "arguments": args})
    text = next((c["text"] for c in r.get("content", []) if c.get("type") == "text"), "")
    if r.get("isError"):
        raise RuntimeError(f"{name}: {text}")
    return r.get("structuredContent") or json.loads(text)


def lp(n):
    return f"{n:,} LP"


rpc("initialize", {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "lucky-scout-py", "version": "1.0.0"}})

start = call("start_here")
if "Play luck games (single player)" not in start.get("youMay", []):
    sys.exit('This key can\'t "Play luck games (single player)" yet. Switch it on in TikTikLuck under Profile → API key for agents.')
you = start["you"]
print(f"Hi @{you['handle']}. Balance: {lp(you['pointsBalance'])}.")

# 1. Today's free Luck Points.
if not you["checkedInToday"]:
    c = call("check_in")
    print(f"Checked in: +{lp(c.get('awarded') or c.get('amount') or 0)}.")

# 2. A trending luck board for one player.
pick = None
for sort in ("trending", "latest"):
    for g in call("list_games", sort=sort, kind="luck", limit=20)["items"]:
        if g["kind"] != "luck":
            continue
        board = call("get_luck_board", configHash=g["id"])
        if not board.get("multiplayer") and board["outcomes"]:
            pick = (g["id"], board)
            break
    if pick:
        break
if not pick:
    sys.exit("No luck boards to play right now.")
config_hash, board = pick

# 3. Back the likeliest outcome at the smallest stake it allows (0 is a free round, where offered).
outcome = max(board["outcomes"], key=lambda o: o["chance"])
stakes = outcome.get("allowedStakes") or board.get("stakeOptions") or [outcome.get("minStake") or 100]
stake = min(stakes)
print(f'Playing "{board["name"]}": backing "{outcome["label"]}" ({round(outcome["chance"] * 100)}% chance, '
      f'pays {outcome["multiplierX100"] / 100}x) for {lp(stake)}.')
play = call("play_luck_board", configHash=config_hash, outcomeIndex=outcome["index"], stake=stake)
print(f"Won {lp(play['payout'])}!" if play["won"] else "Not this time.", f"Balance: {lp(play['pointsBalance'])}.")

# 4. Re-run the round from its revealed seeds.
plays = call("my_plays", limit=5)["plays"]
last = next((p for p in plays if p.get("playId", p.get("id")) == play["playId"] and p.get("verify")), None) \
    or next((p for p in plays if p.get("verify")), None)
if last:
    v = call("verify_play", **last["verify"])
    print("Verified: the round matches its seeds." if v["ok"] else f"The round did NOT verify: {v['checks']}")
