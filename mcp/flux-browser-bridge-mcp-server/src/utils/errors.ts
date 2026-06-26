export function handleBrowserError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("ECONNREFUSED")) {
      return "Error: Cannot connect to browser. Start Chrome with remote debugging (see README) or use mode=launch.";
    }
    if (error.message.includes("Timeout")) {
      return `Error: Browser action timed out. ${error.message}`;
    }
    return `Error: ${error.message}`;
  }
  return `Error: ${String(error)}`;
}
