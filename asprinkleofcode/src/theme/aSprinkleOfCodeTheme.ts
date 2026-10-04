import { createTheme } from "flowbite-react";

// Role-token utilities only (AD-10 / DESIGN §7): no primitive ramps, raw hex,
// or raw Tailwind palette colours. Focus is a solid 2px ring with a 2px offset
// (§18a A1). Brand-fill hover is the brand glow — a darker hover value is OPEN.
// Also used for text links outside flowbite components (e.g. "Go to the homepage").
export const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary";

export const aSprinkleOfCodeTheme = createTheme({
  navbar: {
    root: {
      base: "bg-background-primary px-2 py-2.5 sm:px-4 border-b border-border-default",
      rounded: {
        on: "rounded-control",
        off: "",
      },
      bordered: {
        on: "border",
        off: "",
      },
      inner: {
        base: "mx-auto flex flex-wrap items-center justify-between",
        fluid: {
          on: "",
          off: "container",
        },
      },
    },

    brand: {
      base: `flex items-center space-x-3 text-brand-primary font-bold rounded-control ${focusRing}`,
    },

    collapse: {
      base: "w-full md:block md:w-auto",
      list: "mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium",
      hidden: {
        on: "hidden",
        off: "",
      },
    },

    link: {
      base: `block py-2 pl-3 pr-4 md:p-0 rounded-control ${focusRing}`,
      active: {
        on: "bg-brand-primary text-text-inverse md:bg-transparent md:text-brand-primary",
        off: "border-b border-border-default text-text-primary hover:bg-background-secondary md:border-0 md:hover:bg-transparent md:hover:text-brand-primary",
      },
      disabled: {
        on: "text-text-secondary hover:cursor-not-allowed",
        off: "",
      },
    },

    toggle: {
      base: `inline-flex items-center rounded-default p-2 text-sm text-text-secondary hover:bg-background-secondary ${focusRing} md:hidden`,
      icon: "h-6 w-6 shrink-0",
      title: "sr-only",
    },
  },
  footer: {
    root: {
      base: "w-full rounded-none bg-background-primary shadow-inner md:flex md:items-center md:justify-between",
      container: "w-full p-6 mx-auto",
      bgDark: "bg-background-primary",
    },
    brand: {
      base: "mb-4 flex items-center sm:mb-0",
      img: "mr-3 h-8 drop-shadow-glow",
      span: "self-center whitespace-nowrap text-2xl font-semibold text-text-primary tracking-wide",
    },
    groupLink: {
      base: "flex flex-wrap text-sm text-text-secondary",
      link: {
        base: "me-4 last:mr-0 md:mr-6 transition duration-200",
        href: `hover:text-brand-primary hover:drop-shadow-glow hover:underline focus-visible:underline ${focusRing}`,
      },
      col: "flex-col space-y-4 text-text-secondary",
    },
    icon: {
      base: `text-text-secondary transition duration-200 hover:text-brand-primary hover:drop-shadow-glow rounded-control ${focusRing}`,
      size: "h-5 w-5",
    },
    title: {
      base: "mb-6 text-sm font-semibold uppercase text-text-secondary tracking-widest",
    },
    divider: {
      base: "my-6 w-full border-border-default sm:mx-auto lg:my-8",
    },
    copyright: {
      base: "text-sm text-text-secondary",
      href: `ml-1 hover:text-brand-primary hover:underline focus-visible:underline ${focusRing}`,
      span: "ml-1 text-brand-primary",
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
    // Only keys that differ from flowbite defaults; the rest fall back to them.
    root: {
      base: "flex items-center justify-center space-x-4 rounded-full",
      inner:
        "relative rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] avatar-pulse",
      bordered: "p-1 ring-2 ring-text-primary",
      img: {
        base: "rounded transition-all duration-300",
      },
      size: {
        xl: "h-36 w-36",
      },
    },
  },
});
