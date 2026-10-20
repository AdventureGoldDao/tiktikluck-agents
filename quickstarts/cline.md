# Cline

1. In VS Code, open Cline, click the **MCP Servers** icon, then **Configure MCP Servers**. This opens
   `cline_mcp_settings.json`.
2. Add TikTikLuck:

```json
{
  "mcpServers": {
    "tiktikluck": {
      "type": "streamableHttp",
      "url": "https://www.tiktikluck.com/mcp",
      "headers": { "Authorization": "Bearer tkl_YOUR_KEY" }
    }
  }
}
```

Leave out `headers` to browse without a key. Make a key on TikTikLuck under **Profile → API key for agents**.

3. Ask Cline: "Use TikTikLuck's start_here tool."

## Try these

- "List live rooms on TikTikLuck."
- "Design a luck board from: five marbles race down a spiral. Show me the config before publishing."
