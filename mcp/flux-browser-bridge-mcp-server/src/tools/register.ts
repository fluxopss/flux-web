import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { browserSession } from "../services/browser-session.js";
import { handleBrowserError } from "../utils/errors.js";
import { createErrorResponse, createToolResponse } from "../utils/responses.js";

export function registerBrowserTools(server: McpServer): void {
  server.registerTool(
    "flux_browser_connect",
    {
      title: "Connect Local Browser",
      description:
        "Open or attach to Chrome on your Windows PC.\n\nUse when: starting GHL UI work, first browser action in a session.\nDo NOT use when: already connected (check flux_browser_status).\n\nModes:\n- cdp (recommended): attach to your logged-in Chrome via remote debugging port 9222\n- persistent: dedicated Chrome profile (keeps GHL login)\n- launch: fresh ephemeral Chrome window",
      inputSchema: {
        mode: z
          .enum(["launch", "cdp", "persistent"])
          .default("cdp")
          .describe("Connection mode"),
        cdp_url: z
          .string()
          .url()
          .default("http://127.0.0.1:9222")
          .describe("Chrome DevTools Protocol URL for mode=cdp"),
        user_data_dir: z
          .string()
          .optional()
          .describe("Profile directory for mode=persistent"),
        headless: z.boolean().default(false).describe("Run headless (not recommended for GHL login)"),
        start_url: z
          .string()
          .url()
          .optional()
          .describe("Optional URL to open after connect (e.g. GHL workflows)"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ mode, cdp_url, user_data_dir, headless, start_url }) => {
      try {
        const result = await browserSession.connect({
          mode,
          cdpUrl: cdp_url,
          userDataDir: user_data_dir,
          headless,
          startUrl: start_url,
        });
        return createToolResponse(result as Record<string, unknown>, `Connected (${result.mode}) → ${result.title}\n${result.url}`);
      } catch (error) {
        return createErrorResponse(handleBrowserError(error));
      }
    },
  );

  server.registerTool(
    "flux_browser_status",
    {
      title: "Browser Connection Status",
      description: "Check whether the local browser bridge is connected and the current page URL.",
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      const output = {
        connected: browserSession.active,
        url: browserSession.currentUrl,
      };
      return createToolResponse(output);
    },
  );

  server.registerTool(
    "flux_browser_disconnect",
    {
      title: "Disconnect Browser",
      description: "Close the Playwright browser connection. Use when finished with GHL UI work.",
      inputSchema: {},
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        await browserSession.disconnect();
        return createToolResponse({ disconnected: true });
      } catch (error) {
        return createErrorResponse(handleBrowserError(error));
      }
    },
  );

  server.registerTool(
    "flux_browser_navigate",
    {
      title: "Navigate Browser",
      description: "Navigate the connected browser to a URL.",
      inputSchema: {
        url: z.string().url().describe("Destination URL"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ url }) => {
      try {
        const result = await browserSession.navigate(url);
        return createToolResponse(result, `Navigated → ${result.title}`);
      } catch (error) {
        return createErrorResponse(handleBrowserError(error));
      }
    },
  );

  server.registerTool(
    "flux_browser_snapshot",
    {
      title: "Browser Snapshot",
      description:
        "Capture an interactive element tree with refs for click/fill.\n\nUse before any click or fill. Re-snapshot after each navigation or major UI change.",
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        const snapshot = await browserSession.snapshot();
        return createToolResponse(snapshot as unknown as Record<string, unknown>);
      } catch (error) {
        return createErrorResponse(handleBrowserError(error));
      }
    },
  );

  server.registerTool(
    "flux_browser_click",
    {
      title: "Click Element",
      description: "Click an element by ref from flux_browser_snapshot.",
      inputSchema: {
        ref: z.string().regex(/^e\d+$/).describe("Element ref from snapshot"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ ref }) => {
      try {
        const result = await browserSession.click(ref);
        return createToolResponse(result);
      } catch (error) {
        return createErrorResponse(handleBrowserError(error));
      }
    },
  );

  server.registerTool(
    "flux_browser_fill",
    {
      title: "Fill Input",
      description: "Fill a text input by ref from flux_browser_snapshot.",
      inputSchema: {
        ref: z.string().regex(/^e\d+$/).describe("Element ref from snapshot"),
        text: z.string().max(5000).describe("Text to type"),
        press_enter: z.boolean().default(false).describe("Press Enter after fill"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ ref, text, press_enter }) => {
      try {
        const result = await browserSession.fill(ref, text, press_enter);
        return createToolResponse(result);
      } catch (error) {
        return createErrorResponse(handleBrowserError(error));
      }
    },
  );

  server.registerTool(
    "flux_browser_press_key",
    {
      title: "Press Key",
      description: "Press a keyboard key in the active page (e.g. Enter, Escape, Control+s).",
      inputSchema: {
        key: z.string().min(1).max(40).describe("Playwright key name"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ key }) => {
      try {
        const result = await browserSession.pressKey(key);
        return createToolResponse(result);
      } catch (error) {
        return createErrorResponse(handleBrowserError(error));
      }
    },
  );

  server.registerTool(
    "flux_browser_wait",
    {
      title: "Wait",
      description: "Wait for page load, network idle, or a fixed timeout.",
      inputSchema: {
        condition: z.enum(["load", "networkidle", "timeout"]).default("load"),
        timeout_ms: z.number().int().min(100).max(120_000).default(5000),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ condition, timeout_ms }) => {
      try {
        const result = await browserSession.waitFor(condition, timeout_ms);
        return createToolResponse(result);
      } catch (error) {
        return createErrorResponse(handleBrowserError(error));
      }
    },
  );

  server.registerTool(
    "flux_browser_screenshot",
    {
      title: "Screenshot",
      description: "Capture a PNG screenshot of the current page for visual verification.",
      inputSchema: {
        full_page: z.boolean().default(false).describe("Capture full scrollable page"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ full_page }) => {
      try {
        const result = await browserSession.screenshot(full_page);
        return createToolResponse({
          mime_type: result.mime_type,
          url: result.url,
          base64_preview: `${result.base64.slice(0, 120)}...`,
          base64_length: result.base64.length,
          base64: result.base64,
        });
      } catch (error) {
        return createErrorResponse(handleBrowserError(error));
      }
    },
  );
}
