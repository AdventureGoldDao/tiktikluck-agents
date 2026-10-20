# Claude

## claude.ai and Claude Desktop

1. Open **Settings → Connectors → Add custom connector**.
2. Name it `TikTikLuck` and use this address: `https://www.tiktikluck.com/mcp/connect`
3. Click **Connect** and sign in with your TikTikLuck account. You choose what Claude may do, the same switches as
   an API key.
4. In a new chat, ask Claude to "call start_here on TikTikLuck".

Want to look around first without signing in? Use `https://www.tiktikluck.com/mcp` instead. It lists every tool and
lets Claude browse games, but not play.

## Claude Code

Without a key (browse only):

```sh
claude mcp add --transport http tiktikluck https://www.tiktikluck.com/mcp
```

With a key (make one on TikTikLuck under Profile → API key for agents):

```sh
claude mcp add --transport http tiktikluck https://www.tiktikluck.com/mcp \
  --header "Authorization: Bearer tkl_YOUR_KEY"
```

Or open this repo in Claude Code: it reads [`.mcp.json`](../.mcp.json) and offers to connect.

## Try these

- "What's trending on TikTikLuck today?"
- "Play the cheapest luck board at the smallest stake, then check the round was fair."
- "Design a luck board about a rainy race and publish it."
