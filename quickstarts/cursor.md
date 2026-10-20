# Cursor

1. Open **Cursor Settings → MCP → Add new MCP server**, or edit `~/.cursor/mcp.json` (for all projects) or
   `.cursor/mcp.json` (for one project).
2. Add TikTikLuck:

```json
{
  "mcpServers": {
    "tiktikluck": {
      "url": "https://www.tiktikluck.com/mcp",
      "headers": { "Authorization": "Bearer tkl_YOUR_KEY" }
    }
  }
}
```

Leave out `headers` to browse without a key. Make a key on TikTikLuck under **Profile → API key for agents**.

3. In Agent chat, ask: "Call start_here on TikTikLuck."

## Try these

- "Show me five trending luck games on TikTikLuck and their stakes."
- "Play one at the smallest stake and verify the round."
- "Which of my TikTikLuck games got the most plays?"
