import {
  chromium,
  type Browser,
  type BrowserContext,
  type Locator,
  type Page,
} from "playwright";
import { DEFAULT_CDP_URL, DEFAULT_TIMEOUT_MS } from "../constants.js";

export type ConnectMode = "launch" | "cdp" | "persistent";

export interface ConnectOptions {
  mode: ConnectMode;
  cdpUrl?: string;
  userDataDir?: string;
  headless?: boolean;
  startUrl?: string;
}

export interface SnapshotNode {
  ref: string;
  role: string;
  name: string;
  value?: string;
  tag?: string;
  children: SnapshotNode[];
}

export interface PageSnapshot {
  url: string;
  title: string;
  tree: SnapshotNode[];
}

class BrowserSessionManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private refCounter = 0;
  private refMap = new Map<string, Locator>();

  get active(): boolean {
    return this.page !== null;
  }

  get currentUrl(): string | null {
    return this.page?.url() ?? null;
  }

  async connect(options: ConnectOptions): Promise<{ url: string; title: string; mode: ConnectMode }> {
    await this.disconnect();

    const headless = options.headless ?? false;
    const timeout = DEFAULT_TIMEOUT_MS;

    switch (options.mode) {
      case "cdp": {
        const cdpUrl = options.cdpUrl ?? DEFAULT_CDP_URL;
        this.browser = await chromium.connectOverCDP(cdpUrl, { timeout });
        const contexts = this.browser.contexts();
        this.context = contexts[0] ?? (await this.browser.newContext());
        this.page = this.context.pages()[0] ?? (await this.context.newPage());
        break;
      }
      case "persistent": {
        const userDataDir =
          options.userDataDir ??
          process.env.FLUX_BROWSER_USER_DATA_DIR ??
          "C:\\Users\\jonat\\AppData\\Local\\flux-browser-bridge-profile";
        this.context = await chromium.launchPersistentContext(userDataDir, {
          headless,
          channel: "chrome",
          viewport: { width: 1440, height: 900 },
        });
        this.page = this.context.pages()[0] ?? (await this.context.newPage());
        break;
      }
      case "launch":
      default: {
        this.browser = await chromium.launch({
          headless,
          channel: "chrome",
        });
        this.context = await this.browser.newContext({
          viewport: { width: 1440, height: 900 },
        });
        this.page = await this.context.newPage();
        break;
      }
    }

    this.page.setDefaultTimeout(timeout);
    this.refCounter = 0;
    this.refMap.clear();

    if (options.startUrl) {
      await this.page.goto(options.startUrl, { waitUntil: "domcontentloaded" });
    }

    return {
      url: this.page.url(),
      title: await this.page.title(),
      mode: options.mode,
    };
  }

  async disconnect(): Promise<void> {
    this.refMap.clear();
    this.refCounter = 0;

    if (this.context && !this.browser) {
      await this.context.close();
    } else if (this.browser) {
      await this.browser.close();
    }

    this.page = null;
    this.context = null;
    this.browser = null;
  }

  requirePage(): Page {
    if (!this.page) {
      throw new Error("Browser not connected. Call flux_browser_connect first.");
    }
    return this.page;
  }

  async navigate(url: string): Promise<{ url: string; title: string }> {
    const page = this.requirePage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    this.refMap.clear();
    this.refCounter = 0;
    return { url: page.url(), title: await page.title() };
  }

  private nextRef(): string {
    this.refCounter += 1;
    return `e${this.refCounter}`;
  }

  async snapshot(): Promise<PageSnapshot> {
    const page = this.requirePage();
    this.refMap.clear();
    this.refCounter = 0;

    const tree = await this.buildSnapshotTree(page.locator(":root"));
    return {
      url: page.url(),
      title: await page.title(),
      tree,
    };
  }

  private async buildSnapshotTree(locator: ReturnType<Page["locator"]>): Promise<SnapshotNode[]> {
    const nodes: SnapshotNode[] = [];
    const handle = await locator.elementHandle({ timeout: 2000 }).catch(() => null);
    if (!handle) {
      return nodes;
    }

    const children = await handle.evaluate((root) => {
      const isInteractive = (el: Element): boolean => {
        const tag = el.tagName.toLowerCase();
        if (["button", "a", "input", "textarea", "select", "summary"].includes(tag)) {
          return true;
        }
        const role = el.getAttribute("role");
        if (role && ["button", "link", "textbox", "combobox", "menuitem", "tab"].includes(role)) {
          return true;
        }
        return el.hasAttribute("contenteditable");
      };

      const walk = (el: Element, depth: number): Array<Record<string, unknown>> => {
        if (depth > 8) {
          return [];
        }
        const results: Array<Record<string, unknown>> = [];
        for (const child of Array.from(el.children)) {
          const tag = child.tagName.toLowerCase();
          const role =
            child.getAttribute("role") ??
            (tag === "button"
              ? "button"
              : tag === "a"
                ? "link"
                : tag === "input"
                  ? "textbox"
                  : tag);
          const name =
            child.getAttribute("aria-label") ??
            (child as HTMLInputElement).placeholder ??
            child.textContent?.trim().slice(0, 120) ??
            "";
          const interactive = isInteractive(child);
          const node: Record<string, unknown> = {
            role,
            name,
            tag,
            interactive,
            value: (child as HTMLInputElement).value ?? undefined,
            children: walk(child, depth + 1),
          };
          if (interactive || (node.children as unknown[]).length > 0) {
            results.push(node);
          }
        }
        return results;
      };

      return walk(root, 0);
    });

    const attachRefs = (
      rawNodes: Array<Record<string, unknown>>,
      parentLocator: Locator,
    ): SnapshotNode[] => {
      const result: SnapshotNode[] = [];
      for (const raw of rawNodes) {
        const role = String(raw.role ?? "generic");
        const name = String(raw.name ?? "");
        const tag = raw.tag ? String(raw.tag) : undefined;
        const selector = tag
          ? `${tag}${name ? `:has-text("${name.replace(/"/g, '\\"').slice(0, 40)}")` : ""}`
          : undefined;

        let nodeLocator = parentLocator;
        if (raw.interactive && selector) {
          const ref = this.nextRef();
          nodeLocator = parentLocator.locator(selector).first();
          this.refMap.set(ref, nodeLocator);
          result.push({
            ref,
            role,
            name,
            value: raw.value ? String(raw.value) : undefined,
            tag,
            children: attachRefs(raw.children as Array<Record<string, unknown>>, nodeLocator),
          });
        } else {
          result.push({
            ref: this.nextRef(),
            role,
            name,
            tag,
            children: attachRefs(raw.children as Array<Record<string, unknown>>, parentLocator),
          });
        }
      }
      return result;
    };

    return attachRefs(children as Array<Record<string, unknown>>, locator);
  }

  resolveRef(ref: string): Locator {
    const locator = this.refMap.get(ref);
    if (!locator) {
      throw new Error(`Unknown ref "${ref}". Run flux_browser_snapshot and use a current ref.`);
    }
    return locator;
  }

  async click(ref: string): Promise<{ clicked: true; ref: string }> {
    const locator = this.resolveRef(ref);
    await locator.click();
    return { clicked: true, ref };
  }

  async fill(ref: string, text: string, pressEnter = false): Promise<{ filled: true; ref: string }> {
    const locator = this.resolveRef(ref);
    await locator.fill(text);
    if (pressEnter) {
      await locator.press("Enter");
    }
    return { filled: true, ref };
  }

  async pressKey(key: string): Promise<{ pressed: string }> {
    const page = this.requirePage();
    await page.keyboard.press(key);
    return { pressed: key };
  }

  async waitFor(
    condition: "load" | "networkidle" | "timeout",
    timeoutMs = 5000,
  ): Promise<{ condition: string; elapsed_ms: number }> {
    const page = this.requirePage();
    const start = Date.now();
    if (condition === "load") {
      await page.waitForLoadState("load", { timeout: timeoutMs });
    } else if (condition === "networkidle") {
      await page.waitForLoadState("networkidle", { timeout: timeoutMs });
    } else {
      await page.waitForTimeout(timeoutMs);
    }
    return { condition, elapsed_ms: Date.now() - start };
  }

  async screenshot(fullPage = false): Promise<{ mime_type: string; base64: string; url: string }> {
    const page = this.requirePage();
    const buffer = await page.screenshot({ fullPage, type: "png" });
    return {
      mime_type: "image/png",
      base64: buffer.toString("base64"),
      url: page.url(),
    };
  }

  async evaluate(script: string): Promise<{ result: unknown }> {
    const page = this.requirePage();
    const result = await page.evaluate(({ userScript }) => {
      // eslint-disable-next-line no-eval
      return eval(userScript);
    }, { userScript: script });
    return { result };
  }
}

export const browserSession = new BrowserSessionManager();
