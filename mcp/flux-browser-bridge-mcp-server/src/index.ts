#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { SERVER_NAME, SERVER_VERSION, DEFAULT_HTTP_PORT } from "./constants.js";
import { registerBrowserTools } from "./tools/register.js";

function createServer(): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });
  registerBrowserTools(server);
  return server;
}

async function startStdio(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

async function startHttp(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.post("/mcp", async (req, res) => {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on("close", () => {
      void transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  app.get("/health", (_req, res) => {
    res.json({ ok: true, server: SERVER_NAME, version: SERVER_VERSION });
  });

  const port = Number(process.env.FLUX_BROWSER_HTTP_PORT ?? DEFAULT_HTTP_PORT);
  app.listen(port, "127.0.0.1", () => {
    console.error(`${SERVER_NAME} listening on http://127.0.0.1:${port}/mcp`);
  });
}

const transportMode = process.env.FLUX_BROWSER_TRANSPORT ?? "stdio";

if (transportMode === "http") {
  void startHttp();
} else {
  void startStdio();
}
