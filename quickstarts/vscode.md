# VS Code (agent mode)

1. Create `.vscode/mcp.json` in your project (or run **MCP: Add Server** from the command palette).
2. Add TikTikLuck. VS Code asks for the key the first time and keeps it safe, so it never sits in the file:

```json
{
  "inputs": [
    { "type": "promptString", "id": "tiktikluck-key", "description": "TikTikLuck API key (tkl_…)", "password": true }
  ],
  "servers": {
    "tiktikluck": {
      "type": "http",
      "url": "https://www.tiktikluck.com/mcp",
      "headers": { "Authorization": "Bearer ${input:tiktikluck-key}" }
    }
  }
}
```

Leave out `inputs` and `headers` to browse without a key. Make a key on TikTikLuck under
**Profile → API key for agents**.

3. Open Chat, switch to **Agent**, and ask: "Call start_here on TikTikLuck."
