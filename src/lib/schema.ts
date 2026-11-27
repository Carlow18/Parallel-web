import { z } from "zod";

export const STORAGE_KEY = "parallel.video-board.v1";
export const ALL_FILTER = "__ALL__";
export const UNCATEGORIZED_FILTER = "__UNCATEGORIZED__";

const UNSUPPORTED_HOST_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /(^|\.)youtube\.com$/i, label: "YouTube" },
  { pattern: /(^|\.)youtu\.be$/i, label: "YouTube" },
  { pattern: /(^|\.)vimeo\.com$/i, label: "Vimeo" },
  { pattern: /(^|\.)tiktok\.com$/i, label: "TikTok" },
  { pattern: /(^|\.)instagram\.com$/i, label: "Instagram" },
  { pattern: /(^|\.)x\.com$/i, label: "X" },
  { pattern: /(^|\.)twitter\.com$/i, label: "X / Twitter" },
  { pattern: /(^|\.)loom\.com$/i, label: "Loom" },
];

export const DirectVideoUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid URL starting with http:// or https://")
  .superRefine((value, ctx) => {
    let parsed: URL;
    try {
      parsed = new URL(value);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Malformed URL",
      });
      return;
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only http:// and https:// URLs are supported",
      });
      return;
    }

    const unsupported = UNSUPPORTED_HOST_PATTERNS.find((entry) =>
      entry.pattern.test(parsed.hostname)
    );
    if (unsupported) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${unsupported.label} page links aren't direct video files — use a direct .mp4, .webm, or CDN URL`,
      });
    }
  });

export const VideoItemSchema = z.object({
  id: z.string().min(1),
  url: DirectVideoUrlSchema,
  category: z.string().trim().max(48).default(""),
  title: z.string().trim().max(120).default(""),
  isSample: z.boolean().optional(),
  addedAt: z.number().int().nonnegative(),
});

export type VideoItem = z.infer<typeof VideoItemSchema>;

export const BoardStoreSchema = z.object({
  version: z.literal(1),
  items: z.array(VideoItemSchema),
});

export type BoardStore = z.infer<typeof BoardStoreSchema>;

export interface InvalidLine {
  line: number;
  raw: string;
  reason: string;
}

export interface BulkParseResult {
  validItems: VideoItem[];
  duplicateCount: number;
  invalidLines: InvalidLine[];
}

export function normalizeUrl(raw: string): string {
  try {
    const parsed = new URL(raw.trim());
    return parsed.href;
  } catch {
    return raw.trim();
  }
}

export function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return url;
  }
}

export function deriveTitleFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (!lastSegment) {
      return parsed.hostname.replace(/^www\./i, "");
    }
    const decoded = decodeURIComponent(lastSegment);
    const withoutExt = decoded.replace(/\.(mp4|webm|mov|m4v|ogv)$/i, "");
    const cleaned = withoutExt
      .replace(/[_-]+/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned || decoded;
  } catch {
    return "Untitled clip";
  }
}

export function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `clip-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeCategory(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").slice(0, 48);
}

/**
 * Parses a multi-line bulk paste into validated VideoItems.
 * Supports:
 * - `https://cdn.example.com/clip.mp4`
 * - `https://cdn.example.com/clip.mp4 | Motion`
 * - `https://cdn.example.com/clip.mp4 | Motion | Hero loop`
 */
export function parseBulkInput(
  rawText: string,
  defaultCategory: string,
  existingUrls: Iterable<string> = [],
  now: number = Date.now()
): BulkParseResult {
  const seen = new Set<string>();
  for (const url of existingUrls) {
    seen.add(normalizeUrl(url));
  }

  const lines = rawText.split(/\r?\n/);
  const validItems: VideoItem[] = [];
  const invalidLines: InvalidLine[] = [];
  let duplicateCount = 0;

  const fallbackCategory = normalizeCategory(defaultCategory);

  lines.forEach((lineText, idx) => {
    const trimmed = lineText.trim();
    if (!trimmed) return;

    const parts = trimmed.split("|").map((part) => part.trim());
    const rawUrl = parts[0] ?? "";
    const inlineCategory = parts[1] !== undefined ? normalizeCategory(parts[1]) : "";
    const inlineTitle = parts[2] !== undefined ? parts[2].slice(0, 120) : "";

    const urlCheck = DirectVideoUrlSchema.safeParse(rawUrl);
    if (!urlCheck.success) {
      invalidLines.push({
        line: idx + 1,
        raw: trimmed,
        reason: urlCheck.error.issues[0]?.message ?? "Invalid URL",
      });
      return;
    }

    const normalized = normalizeUrl(urlCheck.data);
    if (seen.has(normalized)) {
      duplicateCount += 1;
      return;
    }

    const category = inlineCategory || fallbackCategory;
    const title = inlineTitle || deriveTitleFromUrl(normalized);

    const itemCheck = VideoItemSchema.safeParse({
      id: createId(),
      url: normalized,
      category,
      title,
      addedAt: now + validItems.length,
    });

    if (!itemCheck.success) {
      invalidLines.push({
        line: idx + 1,
        raw: trimmed,
        reason: itemCheck.error.issues[0]?.message ?? "Invalid clip entry",
      });
      return;
    }

    seen.add(normalized);
    validItems.push(itemCheck.data);
  });

  return { validItems, duplicateCount, invalidLines };
}

export function loadBoardFromStorage(): { items: VideoItem[]; recoveredError: boolean } {
  if (typeof window === "undefined") {
    return { items: [], recoveredError: false };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { items: [], recoveredError: false };
    }
    const parsedJson: unknown = JSON.parse(raw);
    const validated = BoardStoreSchema.safeParse(parsedJson);
    if (validated.success) {
      return { items: validated.data.items, recoveredError: false };
    }
    return { items: [], recoveredError: true };
  } catch {
    return { items: [], recoveredError: true };
  }
}

export function saveBoardToStorage(items: VideoItem[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    const payload: BoardStore = { version: 1, items };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function serializeBoardExport(items: VideoItem[]): string {
  const payload: BoardStore = { version: 1, items };
  return JSON.stringify(payload, null, 2);
}
