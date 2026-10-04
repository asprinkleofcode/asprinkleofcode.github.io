/**
 * The single source of truth for content frontmatter: schema types, the
 * capability vocabulary, and every validation rule (AD-2, AD-5, AD-20).
 *
 * Pure TypeScript with no DOM or Node imports, so the build plugin
 * (`plugins/contentFrontmatter.ts`) and the browser registry share it.
 */

export const CAPABILITIES = [
  "business-to-engineering",
  "ownership",
  "engineering-judgment",
  "ambiguity",
  "enablement",
] as const;
export type Capability = (typeof CAPABILITIES)[number];

/** Content types, one per directory under `src/content/`. */
export const CONTENT_TYPES = ["work", "personal"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const WORK_PATHS = ["engineering", "leadership"] as const;
export type WorkPath = (typeof WORK_PATHS)[number];

/** Path segment personal entries live under. */
export const PERSONAL_PATH = "beyond";
export type PersonalPath = typeof PERSONAL_PATH;

export interface ContentLink {
  label: string;
  href: string;
}

export interface WorkFrontmatter {
  type: "work";
  title: string;
  path: WorkPath;
  slug?: string;
  summary: string;
  role: string;
  capabilities: Capability[];
  date?: string;
  hero?: string;
  featured?: number;
  draft?: boolean;
}

export interface PersonalFrontmatter {
  type: "personal";
  title: string;
  slug?: string;
  summary: string;
  date?: string;
  hero?: string;
  links?: ContentLink[];
  pdf?: string;
  featured?: number;
  draft?: boolean;
  /** Normalized: defaults to `true` when the file omits it. */
  listed: boolean;
}

export type Frontmatter = WorkFrontmatter | PersonalFrontmatter;

export class FrontmatterError extends Error {
  readonly file: string;
  readonly problems: string[];

  constructor(file: string, problems: string[]) {
    super(`Invalid frontmatter in ${file}:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    this.name = "FrontmatterError";
    this.file = file;
    this.problems = problems;
  }
}

export const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const PDF = /^\/downloads\/[a-z0-9]+(?:-[a-z0-9]+)*\.pdf$/;

type KeyRule = (value: unknown, key: string) => string | null;

const nonEmptyString: KeyRule = (v, k) =>
  typeof v === "string" && v.trim() !== "" ? null : `"${k}" must be a non-empty string`;

const oneOf =
  (allowed: readonly string[]): KeyRule =>
  (v, k) =>
    typeof v === "string" && allowed.includes(v)
      ? null
      : `"${k}" must be one of ${allowed.join(", ")} (got ${JSON.stringify(v)})`;

const boolean: KeyRule = (v, k) => (typeof v === "boolean" ? null : `"${k}" must be true or false`);

const slug: KeyRule = (v, k) =>
  typeof v === "string" && KEBAB_CASE.test(v) ? null : `"${k}" must be kebab-case (got ${JSON.stringify(v)})`;

const date: KeyRule = (v, k) => {
  const match = typeof v === "string" ? DATE.exec(v) : null;
  if (match) {
    const [, y, m, d] = match.map(Number);
    const parsed = new Date(Date.UTC(y, m - 1, d));
    if (parsed.getUTCFullYear() === y && parsed.getUTCMonth() === m - 1 && parsed.getUTCDate() === d) {
      return null;
    }
  }
  return `"${k}" must be a real date written YYYY-MM-DD (got ${JSON.stringify(v)})`;
};

const featured: KeyRule = (v, k) =>
  typeof v === "number" && Number.isInteger(v) && v > 0
    ? null
    : `"${k}" must be a positive integer (got ${JSON.stringify(v)})`;

const capabilities: KeyRule = (v, k) => {
  if (!Array.isArray(v) || v.length === 0) return `"${k}" must be a non-empty list`;
  const bad = v.filter((c) => typeof c !== "string" || !(CAPABILITIES as readonly string[]).includes(c));
  return bad.length === 0
    ? null
    : `"${k}" has unknown value(s) ${bad.map((c) => JSON.stringify(c)).join(", ")}; allowed: ${CAPABILITIES.join(", ")}`;
};

const links: KeyRule = (v, k) => {
  if (!Array.isArray(v)) return `"${k}" must be a list of { label, href }`;
  const problems: string[] = [];
  v.forEach((link, i) => {
    if (typeof link !== "object" || link === null || Array.isArray(link)) {
      problems.push(`"${k}[${i}]" must be a { label, href } object`);
      return;
    }
    const entry = link as Record<string, unknown>;
    for (const extra of Object.keys(entry).filter((key) => key !== "label" && key !== "href")) {
      problems.push(`"${k}[${i}]" has unknown key "${extra}"`);
    }
    if (typeof entry.label !== "string" || entry.label.trim() === "") {
      problems.push(`"${k}[${i}].label" must be a non-empty string`);
    }
    if (typeof entry.href !== "string" || !/^https:\/\/\S+$/.test(entry.href)) {
      problems.push(`"${k}[${i}].href" must be an https:// URL (got ${JSON.stringify(entry.href)})`);
    }
  });
  return problems.length === 0 ? null : problems.join("; ");
};

const pdf: KeyRule = (v, k) =>
  typeof v === "string" && PDF.test(v)
    ? null
    : `"${k}" must look like /downloads/<kebab-name>.pdf (got ${JSON.stringify(v)})`;

interface Schema {
  required: Record<string, KeyRule>;
  optional: Record<string, KeyRule>;
}

const SCHEMAS: Record<ContentType, Schema> = {
  work: {
    required: {
      type: oneOf(["work"]),
      title: nonEmptyString,
      path: oneOf(WORK_PATHS),
      summary: nonEmptyString,
      role: nonEmptyString,
      capabilities,
    },
    optional: { slug, date, hero: nonEmptyString, featured, draft: boolean },
  },
  personal: {
    required: {
      type: oneOf(["personal"]),
      title: nonEmptyString,
      summary: nonEmptyString,
    },
    optional: {
      slug,
      date,
      hero: nonEmptyString,
      links,
      pdf,
      featured,
      draft: boolean,
      listed: boolean,
    },
  },
};

export function isContentType(value: string): value is ContentType {
  return (CONTENT_TYPES as readonly string[]).includes(value);
}

/**
 * Validates `data` (parsed YAML, or `undefined` when the file has no
 * frontmatter) against the schema for `type`, which comes from the file's
 * directory. Returns normalized frontmatter or throws a `FrontmatterError`
 * listing every problem.
 */
export function parseFrontmatter(type: ContentType, data: unknown, file: string): Frontmatter {
  const schema = SCHEMAS[type];
  if (data !== undefined && data !== null && (typeof data !== "object" || Array.isArray(data))) {
    throw new FrontmatterError(file, ["frontmatter must be a YAML mapping of keys to values"]);
  }
  const record = (data ?? {}) as Record<string, unknown>;
  const problems: string[] = [];

  for (const key of Object.keys(record)) {
    if (!Object.hasOwn(schema.required, key) && !Object.hasOwn(schema.optional, key)) {
      problems.push(`unknown key "${key}"`);
    }
  }
  for (const [key, rule] of Object.entries(schema.required)) {
    if (record[key] === undefined || record[key] === null) {
      problems.push(`missing required key "${key}"`);
      continue;
    }
    const problem = rule(record[key], key);
    if (problem) {
      problems.push(
        key === "type" ? `"type" must be "${type}" to match its directory (got ${JSON.stringify(record[key])})` : problem
      );
    }
  }
  for (const [key, rule] of Object.entries(schema.optional)) {
    if (record[key] === undefined) continue;
    const problem = rule(record[key], key);
    if (problem) problems.push(problem);
  }

  if (problems.length > 0) throw new FrontmatterError(file, problems);

  if (type === "personal") {
    return { ...record, listed: record.listed ?? true } as PersonalFrontmatter;
  }
  return { ...record } as unknown as WorkFrontmatter;
}
