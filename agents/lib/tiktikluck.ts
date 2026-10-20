/**
 * A tiny helper shared by the samples: connect to TikTikLuck's MCP server and call a tool.
 *
 * The key comes from the TIKTIKLUCK_KEY environment variable and is only ever sent as a header.
 * TIKTIKLUCK_URL can point the samples at another copy of the server (it defaults to the live site).
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export const SERVER = process.env.TIKTIKLUCK_URL ?? "https://www.tiktikluck.com/mcp";

export type Tools = { call: <T = any>(name: string, args?: Record<string, unknown>) => Promise<T>; close: () => Promise<void> };

export async function connect(): Promise<Tools> {
  const key = process.env.TIKTIKLUCK_KEY;
  if (!key) {
    console.error("Set TIKTIKLUCK_KEY to your API key (make one on TikTikLuck under Profile → API key for agents).");
    process.exit(1);
  }
  const transport = new StreamableHTTPClientTransport(new URL(SERVER), {
    requestInit: { headers: { Authorization: `Bearer ${key}` } },
  });
  const client = new Client({ name: "tiktikluck-sample", version: "1.0.0" });
  await client.connect(transport);

  async function call<T = any>(name: string, args: Record<string, unknown> = {}): Promise<T> {
    const r = (await client.callTool({ name, arguments: args })) as {
      isError?: boolean;
      structuredContent?: unknown;
      content?: { type: string; text?: string }[];
    };
    const text = r.content?.find((c) => c.type === "text")?.text ?? "";
    if (r.isError) throw new Error(`${name}: ${text}`);
    return (r.structuredContent ?? JSON.parse(text)) as T;
  }
  return { call, close: () => client.close() };
}

/** Stops with a plain message if the key is missing a switch this sample needs. */
export async function requireSwitch(tools: Tools, label: string) {
  const start = await tools.call<{ connected: boolean; you?: { handle: string; pointsBalance: number; checkedInToday: boolean }; youMay?: string[] }>("start_here");
  if (!start.youMay?.includes(label)) {
    console.error(`This key can't "${label}" yet. Switch it on in TikTikLuck under Profile → API key for agents.`);
    await tools.close();
    process.exit(1);
  }
  return start;
}

export const lp = (n: number) => `${n.toLocaleString("en-US")} LP`;
