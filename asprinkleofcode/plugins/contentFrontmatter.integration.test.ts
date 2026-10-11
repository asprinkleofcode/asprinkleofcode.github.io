// @vitest-environment node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer, type ViteDevServer } from "vite";
import { afterEach, describe, expect, it } from "vitest";
import type { MDXModule } from "mdx/types";
import viteConfig from "../vite.config";
import type { Frontmatter } from "../src/lib/frontmatter";

/**
 * Runs the real plugin chain from vite.config.ts (contentFrontmatter, then
 * mdx() pre, then react) through Vite on committed fixture roots, loading a
 * module that uses the same globs as src/lib/registry.ts.
 */

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), "__fixtures__");

interface FixtureRegistry {
  frontmatters: Record<string, Frontmatter | null>;
  bodies: Record<string, () => Promise<MDXModule>>;
}

let server: ViteDevServer | undefined;

async function loadFixture(name: string) {
  server = await createServer({
    configFile: false,
    root: path.join(fixtures, name),
    plugins: viteConfig.plugins,
    logLevel: "silent",
    appType: "custom",
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  return (await server.ssrLoadModule("/src/lib/fixtureRegistry.ts")) as FixtureRegistry;
}

async function render(registry: FixtureRegistry, file: string): Promise<string> {
  const mod = await registry.bodies[file]();
  expect(typeof mod.default).toBe("function");
  return renderToStaticMarkup(createElement(mod.default));
}

afterEach(async () => {
  await server?.close();
  server = undefined;
});

describe("content pipeline through Vite", () => {
  it("serves validated frontmatter, nulls drafts, and compiles bodies to components", async () => {
    const registry = await loadFixture("valid");

    expect(registry.frontmatters["../content/work/valid-work.mdx"]).toEqual({
      type: "work",
      title: "Valid Work",
      path: "engineering",
      summary: "A valid work fixture.",
      role: "Tech lead",
      capabilities: ["ownership", "enablement"],
      date: "2026-01-15",
      featured: 1,
      highlight: { headline: "A valid highlight headline.", metric: "4,500", unit: "fixture syncs a day" },
      hero: { src: "engineering/fixture-hero.webp", alt: "A fixture hero image." },
    });
    // The same featured value in another path is allowed, as is a metric-free highlight.
    expect(registry.frontmatters["../content/personal/valid-personal.mdx"]).toMatchObject({
      type: "personal",
      title: "Valid Personal",
      listed: true,
      featured: 1,
      highlight: { headline: "A personal highlight with no metric." },
    });
    expect(registry.frontmatters["../content/work/draft-work.mdx"]).toBeNull();

    const html = await render(registry, "../content/work/valid-work.mdx");
    expect(html).toMatch(/<h2 [^>]*>Context<\/h2>/);
    expect(html).toContain("<h3>Valid work subheading</h3>");
    expect(html).toContain("WORKBODYMARKER");
    expect(html).not.toContain("type: work");
    expect(await render(registry, "../content/personal/valid-personal.mdx")).toContain("PERSONALBODYMARKER");

    expect(await render(registry, "../content/work/draft-work.mdx")).toBe("");
    const draftCode = (await server!.transformRequest("/src/content/work/draft-work.mdx", { ssr: true }))?.code ?? "";
    expect(draftCode).not.toMatch(/DRAFT(BODY|TITLE|SUMMARY)MARKER/);
  });

  it("fails with a FrontmatterError naming the file and key", async () => {
    const error: unknown = await loadFixture("invalid").then(
      () => undefined,
      (e: unknown) => e
    );
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).name).toBe("FrontmatterError");
    expect((error as Error).message).toContain("src/content/work/bad-key.mdx");
    expect((error as Error).message).toContain('unknown key "tags"');
    expect((error as Error).message).toContain('"highlight.unit" needs a "highlight.metric"');
  });

  it("fails a featured entry without a highlight, a bare-string hero and a repeated capability, naming the file", async () => {
    const error: unknown = await loadFixture("invalid-schema").then(
      () => undefined,
      (e: unknown) => e
    );
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).name).toBe("FrontmatterError");
    const { message } = error as Error;
    expect(message).toContain("src/content/work/bad-schema.mdx");
    expect(message).toContain('"featured" needs a "highlight" block for the path card');
    expect(message).toContain('"hero" must be a { src, alt } object');
    expect(message).toContain('"capabilities" lists "ownership" more than once');
  });

  it("fails when two entries in one path share a featured value, naming both files", async () => {
    const error: unknown = await loadFixture("invalid-featured").then(
      () => undefined,
      (e: unknown) => e
    );
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).name).toBe("FrontmatterError");
    expect((error as Error).message).toMatch(
      /src\/content\/work\/(first|second)-featured\.mdx[\s\S]*"featured: 1" is already used by src\/content\/work\/(first|second)-featured\.mdx in the engineering path/
    );
    expect((error as Error).message).toContain("first-featured.mdx");
    expect((error as Error).message).toContain("second-featured.mdx");
  });

  it("fails when a hero file is missing, naming the file and path", async () => {
    const error: unknown = await loadFixture("invalid-hero").then(
      () => undefined,
      (e: unknown) => e
    );
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).name).toBe("FrontmatterError");
    expect((error as Error).message).toContain("src/content/work/missing-hero.mdx");
    expect((error as Error).message).toContain(
      '"hero.src" file src/assets/media/engineering/no-such-photo.webp does not exist'
    );
  });

  it("fails a work story whose body breaks the section rules, naming the file", async () => {
    const error: unknown = await loadFixture("invalid-body").then(
      () => undefined,
      (e: unknown) => e
    );
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).name).toBe("FrontmatterError");
    expect((error as Error).message).toContain("src/content/work/missing-outcome.mdx");
    expect((error as Error).message).toContain("missing required story section(s): outcome");
  });
});
