import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { act, configure, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { MDXModule } from "mdx/types";
import { MemoryRouter, useNavigate, type NavigateFunction } from "react-router";
import indexHtml from "../index.html?raw";
import App from "./App";
import { IDENTITY } from "./lib/identity";
import { expectNoFlowbiteDefaults } from "./test/expectNoFlowbiteDefaults";
import type { Entry } from "./lib/registry";
import type { PersonalFrontmatter, WorkFrontmatter } from "./lib/frontmatter";

const bodyModule = (text: string) =>
  ({ default: () => <p>{text}</p> }) as unknown as MDXModule;

const work = (slug: string, title: string, path: WorkFrontmatter["path"] = "engineering"): Entry => ({
  key: `work/${path}/${slug}`,
  path,
  slug,
  file: `../content/work/${slug}.mdx`,
  listed: true,
  frontmatter: {
    type: "work",
    title,
    path,
    summary: `${title} summary.`,
    role: "Lead",
    capabilities: ["ownership"],
  },
});

const personal: Entry = {
  key: "personal/beyond/garden",
  path: "beyond",
  slug: "garden",
  file: "../content/personal/garden.mdx",
  listed: true,
  frontmatter: { type: "personal", title: "Garden", summary: "Garden summary.", listed: true } as PersonalFrontmatter,
};

const fixtures: Entry[] = [
  work("foo", "Foo Story"),
  work("throws", "Throwing Story"),
  work("chunk-fails", "Chunk Failure Story"),
  work("pending", "Pending Story"),
  personal,
];

const bodies: Record<string, () => Promise<MDXModule>> = {
  "work/engineering/foo": () => Promise.resolve(bodyModule("Foo body text.")),
  "work/engineering/throws": () =>
    Promise.resolve({
      default: () => {
        throw new Error("Body render failed");
      },
    } as unknown as MDXModule),
  "work/engineering/chunk-fails": () => Promise.reject(new Error("Failed to fetch dynamically imported module")),
  "work/engineering/pending": () => new Promise<MDXModule>(() => {}),
  "personal/beyond/garden": () => Promise.resolve(bodyModule("Garden body text.")),
};

// First loads of lazy page chunks (AboutMe pulls in images) can exceed the 1s
// default when test files run in parallel.
configure({ asyncUtilTimeout: 5000 });

const ambient = vi.hoisted(() => ({ absent: false, throws: false }));
vi.mock("./components/AmbientLayer/AmbientLayer", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./components/AmbientLayer/AmbientLayer")>();
  const Real = actual.default;
  return {
    default: () => {
      if (ambient.throws) throw new Error("Ambient layer failed");
      return ambient.absent ? null : <Real />;
    },
  };
});

// Path-aware index state; empty by default (zero content), set per test.
const registry = vi.hoisted(() => ({
  pathEntries: {} as Record<string, Entry[]>,
  featured: {} as Record<string, Entry>,
}));
vi.mock("./lib/registry", () => ({
  entries: [],
  getPathEntries: (path: string) => registry.pathEntries[path] ?? [],
  getFeaturedEntry: (path: string) => registry.featured[path],
  getEntry: (path: string, slug: string) => fixtures.find((e) => e.path === path && e.slug === slug),
  loadBody: (entry: Entry) => bodies[entry.key](),
}));

let navigate: NavigateFunction;
function NavigateProbe() {
  navigate = useNavigate();
  return null;
}

function renderAt(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
      <NavigateProbe />
    </MemoryRouter>
  );
}

const h1 = (name: string | RegExp) => screen.findByRole("heading", { level: 1, name });

function setScrollY(y: number) {
  Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: y });
  window.dispatchEvent(new Event("scroll"));
}

describe("App smoke test", () => {
  let consoleError: MockInstance<typeof console.error>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error");
  });

  afterEach(() => {
    consoleError.mockRestore();
    setScrollY(0);
  });

  it.each([
    { route: "/", heading: IDENTITY.name },
    { route: "/about", heading: "Alisha Sprinkle Korba" },
    { route: "/engineering", heading: "Engineering" },
    { route: "/leadership", heading: "Leadership & Enablement" },
    { route: "/beyond", heading: "Beyond the Code" },
    { route: "/nope", heading: "Page not found" },
  ])("renders $route without throwing or console errors", async ({ route, heading }) => {
    renderAt(route);
    expect(await h1(heading)).toBeDefined();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it.each(["/engineering", "/leadership", "/beyond"])("shows the empty state on %s", async (route) => {
    renderAt(route);
    expect(await screen.findByText("No stories published yet.")).toBeDefined();
  });

  it("renders a known work story with its lazily loaded body", async () => {
    renderAt("/engineering/foo");
    expect(await h1("Foo Story")).toBeDefined();
    expect(screen.getByText("Foo Story summary.")).toBeDefined();
    expect(screen.getByText("Foo body text.")).toBeDefined();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("renders a known personal story", async () => {
    renderAt("/beyond/garden");
    expect(await h1("Garden")).toBeDefined();
    expect(screen.getByText("Garden body text.")).toBeDefined();
  });

  it.each(["/engineering/missing", "/leadership/foo", "/beyond/foo"])(
    "renders not-found for unknown detail %s with the nav intact",
    async (route) => {
      renderAt(route);
      expect(await h1("Page not found")).toBeDefined();
      expect(screen.getByRole("link", { name: "Go to the homepage" }).getAttribute("href")).toBe("/");
      expect(screen.getByRole("link", { name: "Home" })).toBeDefined();
      expect(consoleError).not.toHaveBeenCalled();
    }
  );

  it.each([
    { route: "/engineering/throws", why: "a render error" },
    { route: "/engineering/chunk-fails", why: "a rejected lazy import" },
  ])("shows the error fallback for $why and keeps header and footer", async ({ route }) => {
    consoleError.mockImplementation(() => {});
    renderAt(route);

    expect(await h1("Something went wrong")).toBeDefined();
    expect(screen.getByRole("button", { name: "Try again" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Go to the homepage" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Home" })).toBeDefined();
    expect(screen.getByRole("contentinfo")).toBeDefined();

    // The boundary resets on the next location change.
    act(() => navigate("/engineering"));
    expect(await h1("Engineering")).toBeDefined();
  });


  it("reloads the page from the error fallback's Try again button", async () => {
    consoleError.mockImplementation(() => {});
    const reload = vi.fn();
    const original = window.location;
    Object.defineProperty(window, "location", { configurable: true, value: { ...original, reload } });
    try {
      renderAt("/engineering/throws");
      fireEvent.click(await screen.findByRole("button", { name: "Try again" }));
      expect(reload).toHaveBeenCalled();
    } finally {
      Object.defineProperty(window, "location", { configurable: true, value: original });
    }
  });

  it("keeps the header visible while a route is suspended", async () => {
    renderAt("/engineering/pending");
    expect(await screen.findByRole("status")).toBeDefined();
    expect(screen.getByRole("status").textContent).toBe("Loading…");
    expect(screen.getByRole("link", { name: "Home" })).toBeDefined();
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
  });

  it("links the header brand to the home route", async () => {
    renderAt("/about");
    expect(screen.getByRole("link", { name: "Alisha Korba" }).getAttribute("href")).toBe("/");
    await h1("Alisha Sprinkle Korba");
  });

  it("navigates through header path links with the router (PUSH)", async () => {
    renderAt("/");
    await h1(IDENTITY.name);
    // Scoped to the header: the homepage's Explore tiles carry the same labels.
    const leadership = within(screen.getByRole("navigation", { name: "Main" })).getByRole("link", {
      name: "Leadership & Enablement",
    });
    expect(leadership.getAttribute("href")).toBe("/leadership");
    fireEvent.click(leadership);
    const heading = await h1("Leadership & Enablement");
    await waitFor(() => expect(document.activeElement).toBe(heading));
    expect(leadership.getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBeNull();
  });

  describe("homepage exploration (Story 1.7)", () => {
    const explore = () => screen.getByRole("region", { name: "Explore" });

    afterEach(() => {
      registry.pathEntries = {};
      registry.featured = {};
    });

    it("shows each path's featured entry under its own label, Highlights after Explore", async () => {
      const hint: Entry = {
        ...personal,
        key: "personal/beyond/lifting",
        slug: "lifting",
        frontmatter: { ...personal.frontmatter, title: "Lifting", summary: "I lift heavy things." } as PersonalFrontmatter,
      };
      registry.featured = {
        engineering: work("eng-feat", "Eng Featured"),
        leadership: work("lead-feat", "Lead Featured", "leadership"),
        beyond: hint,
      };
      renderAt("/");
      await h1(IDENTITY.name);
      const highlights = screen.getByRole("region", { name: "Highlights" });
      expect(explore().compareDocumentPosition(highlights) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

      const rows = within(highlights).getAllByRole("listitem");
      expect(
        rows.map((row) => [row.firstElementChild?.textContent, within(row).getByRole("link").textContent, within(row).getByRole("link").getAttribute("href")])
      ).toEqual([
        ["Engineering", "Eng Featured", "/engineering/eng-feat"],
        ["Leadership & Enablement", "Lead Featured", "/leadership/lead-feat"],
        ["Beyond the Code", "I lift heavy things.", "/beyond/lifting"],
      ]);
    });

    it.each([
      { route: "/engineering", label: "Engineering", path: "engineering" },
      { route: "/leadership", label: "Leadership & Enablement", path: "leadership" },
      { route: "/beyond", label: "Beyond the Code", path: "beyond" },
    ])("lists only $path entries on $route", async ({ route, label, path }) => {
      const beyondEntry = (slug: string, title: string): Entry => ({
        ...personal,
        key: `personal/beyond/${slug}`,
        slug,
        frontmatter: { ...personal.frontmatter, title } as PersonalFrontmatter,
      });
      registry.pathEntries = {
        engineering: [work("eng-a", "Eng A"), work("eng-b", "Eng B")],
        leadership: [work("lead-a", "Lead A", "leadership")],
        beyond: [beyondEntry("btc-a", "Btc A")],
      };
      renderAt(route);
      await h1(label);
      const links = within(screen.getByRole("main")).getAllByRole("link");
      expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual(
        registry.pathEntries[path].map((e) => [e.frontmatter.title, `/${path}/${e.slug}`])
      );
      expect(screen.queryByText("No stories published yet.")).toBeNull();
    });

    it("lists the three path links below Recognition, in order, with no Highlights heading", async () => {
      renderAt("/");
      const heading = await h1(IDENTITY.name);
      const links = within(explore()).getAllByRole("link");
      expect(links.map((a) => [a.textContent?.replace("→", ""), a.getAttribute("href")])).toEqual([
        ["Engineering", "/engineering"],
        ["Leadership & Enablement", "/leadership"],
        ["Beyond the Code", "/beyond"],
      ]);
      expect(heading.compareDocumentPosition(explore()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      // Zero featured content: Evidence & Highlights renders nothing, heading included.
      expect(screen.queryByRole("heading", { name: "Highlights" })).toBeNull();
      expect(consoleError).not.toHaveBeenCalled();
    });

    it.each(["Engineering", "Leadership & Enablement", "Beyond the Code"])(
      "navigates from the %s tile to its index h1 and empty state",
      async (label) => {
        renderAt("/");
        await h1(IDENTITY.name);
        fireEvent.click(within(explore()).getByRole("link", { name: label }));
        const indexHeading = await h1(label);
        await waitFor(() => expect(document.activeElement).toBe(indexHeading));
        expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
        expect(screen.getByText("No stories published yet.")).toBeDefined();
      }
    );
  });

  describe("header and footer on every route", () => {
    const headerLinks = () => screen.getByRole("navigation", { name: "Main" }).querySelectorAll("a");
    const currentLinks = () =>
      [...headerLinks()].filter((a) => a.getAttribute("aria-current") === "page").map((a) => a.textContent);
    const socialNames = () =>
      [...screen.getByRole("navigation", { name: "Social profiles" }).querySelectorAll("a")].map((a) =>
        a.getAttribute("aria-label")
      );

    it.each([
      { route: "/", heading: IDENTITY.name, current: ["Home"] },
      { route: "/engineering", heading: "Engineering", current: ["Engineering"] },
      { route: "/engineering/foo", heading: "Foo Story", current: ["Engineering"] },
      { route: "/beyond/garden", heading: "Garden", current: ["Beyond the Code"] },
      { route: "/leadership/foo", heading: "Page not found", current: ["Leadership & Enablement"] },
      { route: "/about", heading: "Alisha Sprinkle Korba", current: [] },
      { route: "/nope", heading: "Page not found", current: [] },
      { route: "/engineering/throws", heading: "Something went wrong", current: ["Engineering"] },
    ])("renders the same header and footer on $route", async ({ route, heading, current }) => {
      if (route.endsWith("/throws")) consoleError.mockImplementation(() => {});
      renderAt(route);
      await h1(heading);
      expect([...headerLinks()].map((a) => a.textContent)).toEqual([
        "Alisha Korba",
        "Home",
        "Engineering",
        "Leadership & Enablement",
        "Beyond the Code",
      ]);
      expect(currentLinks()).toEqual(current);
      expect(socialNames()).toEqual([
        "LinkedIn (opens in a new tab)",
        "Instagram @asprinkleofcode (opens in a new tab)",
        "Instagram @orangecatwoodcraft (opens in a new tab)",
        "GitHub (opens in a new tab)",
      ]);
      // Header and footer sit outside <main>, so the error boundary never swallows them.
      const main = screen.getByRole("main");
      expect(main.contains(headerLinks()[0])).toBe(false);
      expect(main.contains(screen.getByRole("contentinfo"))).toBe(false);
    });
  });

  describe("homepage identity matches the static head (AD-14)", () => {
    const head = new DOMParser().parseFromString(indexHtml, "text/html");
    const jsonLd = JSON.parse(head.querySelector('script[type="application/ld+json"]')?.textContent ?? "{}") as {
      "@graph"?: { "@type": string; name?: string; jobTitle?: string; description?: string }[];
    };
    const person = jsonLd["@graph"]?.find((node) => node["@type"] === "Person");
    const profilePage = jsonLd["@graph"]?.find((node) => node["@type"] === "ProfilePage");

    it("renders exactly one h1 on /", async () => {
      renderAt("/");
      await h1(IDENTITY.name);
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    });

    it("renders the homepage headshot derivative", async () => {
      renderAt("/");
      await h1(IDENTITY.name);
      expect(screen.getByRole("img", { name: IDENTITY.name }).getAttribute("src")).toContain(
        "alisha-sprinkle-korba-headshot-640"
      );
    });

    it("does not render the homepage on /about", async () => {
      renderAt("/about");
      await h1(IDENTITY.name);
      expect(screen.queryByText(IDENTITY.positioning)).toBeNull();
    });

    it("states the Person JSON-LD name, jobTitle and description as the h1, title and positioning", async () => {
      renderAt("/");
      const heading = await h1(IDENTITY.name);
      const [title, positioning] = [...(heading.closest("section")?.querySelectorAll("p") ?? [])].map(
        (p) => p.textContent
      );
      expect(person).toBeDefined();
      expect(person?.name).toBe(heading.textContent);
      expect(person?.jobTitle).toBe(title);
      expect(person?.description).toBe(positioning);
      expect({ name: person?.name, title: person?.jobTitle, positioning: person?.description }).toEqual(IDENTITY);
    });

    it("carries the identity in every title and description tag", () => {
      for (const [label, value] of [
        ["<title>", head.title],
        ["og:title", head.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? ""],
        ["twitter:title", head.querySelector('meta[name="twitter:title"]')?.getAttribute("content") ?? ""],
        ["ProfilePage name", profilePage?.name ?? ""],
      ]) {
        expect(value, label).toContain(IDENTITY.name);
        expect(value, label).toContain(IDENTITY.title);
      }
      for (const selector of [
        'meta[name="description"]',
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
      ]) {
        const content = head.querySelector(selector)?.getAttribute("content") ?? "";
        expect(content, selector).toContain(IDENTITY.name);
        expect(content, selector).toContain(IDENTITY.title);
        expect(content, selector).toContain(IDENTITY.positioning);
      }
    });
  });

  it("applies the theme's replace map, so the header and footer carry no flowbite dark:/gray- defaults", async () => {
    renderAt("/");
    await h1(IDENTITY.name);
    expectNoFlowbiteDefaults(screen.getByRole("navigation", { name: "Main" }));
    expectNoFlowbiteDefaults(screen.getByRole("contentinfo"));
  });

  it("mounts exactly one ambient layer across route changes", async () => {
    renderAt("/");
    await h1(IDENTITY.name);
    expect(document.querySelectorAll(".ambient-layer")).toHaveLength(1);
    const field = () => (document.querySelector(".ambient-layer__star") as HTMLElement).style.cssText;
    let previous = field();
    // Not `/about`: its h1 is the same name as the homepage's, so awaiting it would not wait for the route.
    for (const [route, heading] of [["/leadership", "Leadership & Enablement"], ["/engineering", "Engineering"], ["/nope", "Page not found"]]) {
      act(() => navigate(route));
      await h1(heading);
      expect(document.querySelectorAll(".ambient-layer")).toHaveLength(1);
      expect(field()).not.toBe(previous); // reshuffled per navigation
      previous = field();
    }
  });

  it("renders and navigates normally when the ambient layer is absent", async () => {
    ambient.absent = true;
    try {
      renderAt("/");
      await h1(IDENTITY.name);
      expect(document.querySelector(".ambient-layer")).toBeNull();
      act(() => navigate("/engineering"));
      expect(await h1("Engineering")).toBeDefined();
      expect(consoleError).not.toHaveBeenCalled();
    } finally {
      ambient.absent = false;
    }
  });

  it("renders and navigates normally when the ambient layer throws", async () => {
    consoleError.mockImplementation(() => {});
    ambient.throws = true;
    try {
      renderAt("/");
      expect(await h1(IDENTITY.name)).toBeDefined();
      expect(document.querySelector(".ambient-layer")).toBeNull();
      act(() => navigate("/engineering"));
      expect(await h1("Engineering")).toBeDefined();
    } finally {
      ambient.throws = false;
    }
  });

  describe("scroll and focus", () => {
    let scrollTo: MockInstance<typeof window.scrollTo>;
    let scrollIntoView: MockInstance<typeof Element.prototype.scrollIntoView>;

    beforeEach(() => {
      scrollTo = vi.spyOn(window, "scrollTo");
      scrollIntoView = vi.spyOn(Element.prototype, "scrollIntoView");
    });

    afterEach(() => {
      scrollTo.mockRestore();
      scrollIntoView.mockRestore();
    });

    it("leaves scroll and focus alone on initial load", async () => {
      renderAt("/engineering");
      await h1("Engineering");
      expect(scrollTo).not.toHaveBeenCalled();
      expect(scrollIntoView).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(document.body);
    });

    it("scrolls to main and focuses the h1 after forward navigation resolves", async () => {
      renderAt("/");
      await h1(IDENTITY.name);

      act(() => navigate("/engineering/foo"));
      const heading = await h1("Foo Story");
      await waitFor(() => expect(document.activeElement).toBe(heading));
      expect(heading.getAttribute("tabindex")).toBe("-1");
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByRole("main"));
    });

    it("does not scroll or focus while a route is still loading", async () => {
      renderAt("/");
      await h1(IDENTITY.name);

      act(() => navigate("/engineering/pending"));
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(scrollIntoView).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(document.body);
    });

    it("restores the saved scroll position on back navigation without moving focus", async () => {
      renderAt("/engineering");
      await h1("Engineering");
      setScrollY(420);

      act(() => navigate("/leadership"));
      const leadership = await h1("Leadership & Enablement");
      await waitFor(() => expect(document.activeElement).toBe(leadership));

      act(() => navigate(-1));
      const engineering = await h1("Engineering");
      await waitFor(() => expect(scrollTo).toHaveBeenLastCalledWith({ top: 420, behavior: "instant" }));
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(document.activeElement).not.toBe(engineering);
    });
  });
});
