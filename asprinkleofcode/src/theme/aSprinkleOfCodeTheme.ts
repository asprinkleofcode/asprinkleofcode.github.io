import { createTheme } from "flowbite-react";

// Role-token utilities only (AD-10 / DESIGN §7): no primitive ramps, raw hex,
// or raw Tailwind palette colours. Focus is a solid 2px ring with a 2px offset
// (§18a A1). Brand-fill hover is the brand glow — a darker hover value is OPEN.
// Also used for text links outside flowbite components (e.g. "Go to the homepage").
export const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary";

// Only slots that differ from the flowbite defaults (or that the defaults would
// fill with raw palette colours); everything else falls back to the defaults.
export const aSprinkleOfCodeTheme = createTheme({
  navbar: {
    root: {
      // Sticky (EXPERIENCE §5.2): `#root` is the containing block, so it must
      // grow with the page (index.css uses min-height, not height).
      base: "sticky top-0 z-40 bg-background-primary px-2 py-2.5 sm:px-4 border-b border-border-default",
    },

    brand: {
      base: `flex items-center space-x-3 text-brand-primary font-bold rounded-control ${focusRing}`,
    },

    link: {
      // md: padding keeps the desktop target at least 24px tall (text-sm/20px + 4px).
      base: `block py-2 pl-3 pr-4 md:px-1 md:py-0.5 rounded-control underline-offset-4 ${focusRing}`,
      active: {
        // Desktop non-colour cue for the current page: an underline.
        on: "bg-brand-primary text-text-inverse md:bg-transparent md:text-brand-primary md:underline",
        off: "border-b border-border-default text-text-primary hover:bg-background-secondary md:border-0 md:hover:bg-transparent md:hover:text-brand-primary md:hover:underline",
      },
    },

    toggle: {
      base: `inline-flex items-center rounded-default p-2 text-sm text-text-secondary hover:bg-background-secondary ${focusRing} md:hidden`,
    },
  },
  footer: {
    root: {
      base: "w-full rounded-none bg-background-primary shadow-inner md:flex md:items-center md:justify-between",
      container: "w-full p-6 mx-auto",
    },
    icon: {
      // p-1 around the 20px icon gives a 28px target. The hover glow is set per
      // icon in Footer.tsx (brand glow, or glow.woodcraft for one icon).
      base: `inline-flex p-1 text-text-secondary hover:text-brand-primary motion-safe:transition motion-safe:duration-200 rounded-control ${focusRing}`,
    },
    copyright: {
      base: "type-meta text-text-secondary",
      span: "ml-1",
    },
  },
  button: {
    base: `font-semibold rounded-default shadow transition-all duration-200 ${focusRing}`,
    color: {
      primary:
        "bg-brand-primary-fill text-text-primary hover:drop-shadow-glow",
      secondary:
        "bg-background-secondary text-text-primary border border-border-default hover:border-border-essential",
    },
    size: {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    },
  },
  avatar: {
    root: {
      base: "flex items-center justify-center space-x-4 rounded-full",
      inner:
        "relative rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] avatar-pulse",
      bordered: "p-1 ring-2 ring-text-primary",
      img: {
        base: "rounded transition-all duration-300",
      },
    },
  },
});
