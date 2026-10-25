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

/**
 * The path-card highlight (AD-2, UX-031). A `unit` never appears without a `metric`,
 * and a personal entry has neither (retro A-9).
 */
export interface Highlight {
  headline: string;
  metric?: string;
  unit?: string;
}

/** A content photo: `src` is a path inside `src/assets/media/` (Conventions → Images). */
export interface HeroImage {
  src: string;
  alt: string;
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
  hero?: HeroImage;
  featured?: number;
  highlight?: Highlight;
  draft?: boolean;
}

export interface PersonalFrontmatter {
  type: "personal";
  title: string;
  slug?: string;
  summary: string;
  date?: string;
  hero?: HeroImage;
  links?: ContentLink[];
  pdf?: string;
  featured?: number;
  highlight?: Highlight;
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
// Relative to src/assets/media/, lowercase kebab-case segments (media/README.md): no `..`, no
// leading slash, and no case that only a case-insensitive file system would resolve.
const MEDIA_SRC = /^(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*\.(?:webp|avif)$/;

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
  if (bad.length > 0) {
    return `"${k}" has unknown value(s) ${bad.map((c) => JSON.stringify(c)).join(", ")}; allowed: ${CAPABILITIES.join(", ")}`;
  }
  const repeated = [...new Set(v.filter((c, i) => v.indexOf(c) !== i))];
  return repeated.length === 0
    ? null
    : `"${k}" lists ${repeated.map((c) => JSON.stringify(c)).join(", ")} more than once`;
};

/** Problems in a `{ … }` block: not an object, unknown keys, missing required fields, each field's rule. */
function blockProblems(
  v: unknown,
  k: string,
  shape: string,
  fields: Record<string, { rule: KeyRule; required: boolean }>
): string[] {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return [`"${k}" must be a ${shape} object`];
  const entry = v as Record<string, unknown>;
  const problems = Object.keys(entry)
    .filter((key) => !Object.hasOwn(fields, key))
    .map((extra) => `"${k}" has unknown key "${extra}"`);
  for (const [key, { rule, required }] of Object.entries(fields)) {
    if (entry[key] === undefined) {
      if (required) problems.push(`"${k}.${key}" is required`);
      continue;
    }
    const problem = rule(entry[key], `${k}.${key}`);
    if (problem) problems.push(problem);
  }
  return problems;
}

const highlight: KeyRule = (v, k) => {
  const problems = blockProblems(v, k, "{ headline, metric?, unit? }", {
    headline: { rule: nonEmptyString, required: true },
    metric: { rule: nonEmptyString, required: false },
    unit: { rule: nonEmptyString, required: false },
  });
  const entry = v as Record<string, unknown>;
  if (problems.length === 0 && entry.unit !== undefined && entry.metric === undefined) {
    problems.push(`"${k}.unit" needs a "${k}.metric"`);
  }
  return problems.length === 0 ? null : problems.join("; ");
};

const notOnPersonal: KeyRule = (_v, k) => `"${k}" is not allowed on personal entries`;

/**
 * A personal entry's highlight carries only a headline: the Beyond the Code card
 * never shows a metric (retro A-9). `metric`/`unit` get a named problem rather
 * than "unknown key", so the fix is obvious.
 */
const personalHighlight: KeyRule = (v, k) => {
  const problems = blockProblems(v, k, "{ headline }", {
    headline: { rule: nonEmptyString, required: true },
    metric: { rule: notOnPersonal, required: false },
    unit: { rule: notOnPersonal, required: false },
  });
  return problems.length === 0 ? null : problems.join("; ");
};

const mediaSrc: KeyRule = (v, k) =>
  typeof v === "string" && MEDIA_SRC.test(v)
    ? null
    : `"${k}" must be a lowercase kebab-case .webp or .avif path inside src/assets/media/, like engineering/diagram.webp (got ${JSON.stringify(v)})`;

const hero: KeyRule = (v, k) => {
  const problems = blockProblems(v, k, "{ src, alt }", {
    src: { rule: mediaSrc, required: true },
    alt: { rule: nonEmptyString, required: true },
  });
  return problems.length === 0 ? null : problems.join("; ");
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
    optional: { slug, date, hero, featured, highlight, draft: boolean },
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
      hero,
      links,
      pdf,
      featured,
      highlight: personalHighlight,
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
  // A featured entry feeds its path card, which needs a highlight (AD-2). Drafts never reach a card.
  if (
    record.featured !== undefined &&
    featured(record.featured, "featured") === null &&
    record.highlight === undefined &&
    record.draft !== true
  ) {
    problems.push('"featured" needs a "highlight" block for the path card');
  }

  if (problems.length > 0) throw new FrontmatterError(file, problems);

  if (type === "personal") {
    return { ...record, listed: record.listed ?? true } as PersonalFrontmatter;
  }
  return { ...record } as unknown as WorkFrontmatter;
}
