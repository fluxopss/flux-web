import { CHARACTER_LIMIT } from "../constants.js";

export function truncateText(text: string, limit = CHARACTER_LIMIT): string {
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit)}\n\n[truncated at ${limit} characters]`;
}

export function createToolResponse(
  output: Record<string, unknown>,
  summary?: string,
): { content: Array<{ type: "text"; text: string }>; structuredContent: Record<string, unknown> } {
  const text = summary ?? JSON.stringify(output, null, 2);
  return {
    content: [{ type: "text", text: truncateText(text) }],
    structuredContent: output,
  };
}

export function createErrorResponse(message: string): {
  content: Array<{ type: "text"; text: string }>;
  isError: true;
} {
  return {
    content: [{ type: "text", text: message }],
    isError: true,
  };
}
