import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "flowbite-react";
import { MemoryRouter, useLocation, useNavigationType } from "react-router";
import { aSprinkleOfCodeApplyTheme, aSprinkleOfCodeTheme } from "../../theme/aSprinkleOfCodeTheme";
import { expectNoFlowbiteDefaults } from "../../test/expectNoFlowbiteDefaults";
import Header from "./Header";

let lastNavigation = "";
function LocationProbe() {
  const { pathname } = useLocation();
  const type = useNavigationType();
  lastNavigation = `${type} ${pathname}`;
  return null;
}

function renderAt(route: string) {
  return render(
    <ThemeProvider theme={aSprinkleOfCodeTheme} applyTheme={aSprinkleOfCodeApplyTheme}>
      <MemoryRouter initialEntries={[route]}>
        <Header />
        <LocationProbe />
      </MemoryRouter>
    </ThemeProvider>
  );
}

const NAV_LABELS = ["Home", "Engineering", "Leadership & Enablement", "Beyond the Code"];

const nav = () => screen.getByRole("navigation", { name: "Main" });
const current = () =>
  within(nav())
    .getAllByRole("link")
    .filter((link) => link.getAttribute("aria-current") === "page")
    .map((link) => link.textContent);

describe("Header", () => {
  it("renders identity then the four path links, in order", () => {
    renderAt("/");
    const links = within(nav()).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(["Alisha Korba", ...NAV_LABELS]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/",
      "/",
      "/engineering",
      "/leadership",
      "/beyond",
    ]);
    expect(screen.queryByRole("link", { name: "About Me" })).toBeNull();
  });

  it("draws the cupcake as a decorative masked mark, not an image", () => {
    renderAt("/");
    const brand = within(nav()).getAllByRole("link")[0];
    expect(brand.querySelector("img")).toBeNull();
    expect(brand.querySelector(".navbar-logo")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("is sticky", () => {
    renderAt("/");
    expect(nav().className).toMatch(/(^|\s)sticky(\s|$)/);
    expect(nav().className).toMatch(/(^|\s)top-0(\s|$)/);
  });

  it.each([
    { route: "/", active: ["Home"] },
    { route: "/engineering", active: ["Engineering"] },
    { route: "/engineering/foo", active: ["Engineering"] },
    { route: "/leadership", active: ["Leadership & Enablement"] },
    { route: "/leadership/x", active: ["Leadership & Enablement"] },
    { route: "/beyond/garden", active: ["Beyond the Code"] },
    { route: "/about", active: [] },
    { route: "/nope", active: [] },
  ])("marks $active as the current page on $route", ({ route, active }) => {
    renderAt(route);
    expect(current()).toEqual(active);
  });

  it("gives the active link an underline as its desktop non-colour cue", () => {
    renderAt("/leadership/x");
    const active = screen.getByRole("link", { name: "Leadership & Enablement" });
    expect(active.className.split(/\s+/)).toContain("md:underline");
    const inactive = screen.getByRole("link", { name: "Engineering" });
    expect(inactive.className.split(/\s+/)).not.toContain("md:underline");
  });

  it("shows a white wordmark independent of type-title, and secondary-text inactive links (UX-030)", () => {
    renderAt("/engineering");
    const brandText = within(nav()).getByText("Alisha Korba");
    const brandClasses = brandText.className.split(/\s+/);
    expect(brandClasses).toEqual(expect.arrayContaining(["text-base", "tracking-[0.02em]"]));
    expect(brandClasses).not.toContain("type-title");
    // Colour comes from the navbar.brand slot on the brand link.
    expect(within(nav()).getAllByRole("link")[0].className.split(/\s+/)).toContain("text-text-primary");

    const active = screen.getByRole("link", { name: "Engineering" }).className.split(/\s+/);
    expect(active).toContain("md:text-brand-primary");
    for (const name of ["Home", "Leadership & Enablement", "Beyond the Code"]) {
      const inactive = screen.getByRole("link", { name }).className.split(/\s+/);
      expect(inactive, name).toContain("text-text-secondary");
      expect(inactive, name).not.toContain("text-text-primary");
    }
  });

  it("renders no flowbite dark-mode or gray palette classes, so OS dark mode keeps the role tokens", () => {
    renderAt("/engineering");
    fireEvent.click(screen.getByRole("button", { name: "Open main menu" }));
    expectNoFlowbiteDefaults(nav());
  });

  it("gives every interactive element the solid focus ring", () => {
    renderAt("/");
    const controls = [
      ...within(nav()).getAllByRole("link"),
      screen.getByRole("button", { name: "Open main menu" }),
    ];
    for (const control of controls) {
      expect(control.className).toContain("focus-visible:ring-2");
      expect(control.className).toContain("focus-visible:ring-focus-ring");
    }
  });

  it("opens the mobile menu, navigates with PUSH, and closes after a pick", () => {
    renderAt("/");
    const collapse = screen.getByTestId("flowbite-navbar-collapse");
    const isHidden = () => collapse.className.split(/\s+/).includes("hidden");
    expect(isHidden()).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Open main menu" }));
    expect(isHidden()).toBe(false);

    fireEvent.click(screen.getByRole("link", { name: "Beyond the Code" }));
    expect(lastNavigation).toBe("PUSH /beyond");
    expect(isHidden()).toBe(true);
    expect(current()).toEqual(["Beyond the Code"]);
  });

  it("closes the mobile menu after navigating from the brand link", () => {
    renderAt("/engineering");
    const collapse = screen.getByTestId("flowbite-navbar-collapse");
    const isHidden = () => collapse.className.split(/\s+/).includes("hidden");

    fireEvent.click(screen.getByRole("button", { name: "Open main menu" }));
    expect(isHidden()).toBe(false);

    fireEvent.click(screen.getByRole("link", { name: "Alisha Korba" }));
    expect(lastNavigation).toBe("PUSH /");
    expect(isHidden()).toBe(true);
  });
});
