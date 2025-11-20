// src/theme/aSprinkleOfCodeTheme.js
export const aSprinkleOfCodeTheme = {
  navbar: {
    root: {
      base: "bg-[#1E1E2F] px-2 py-2.5 sm:px-4 border-b border-[#3A3A4D]",
      rounded: {
        on: "rounded",
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
      base: "flex items-center space-x-3 text-[#E48FB1] font-bold",
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
      base: "block py-2 pl-3 pr-4 md:p-0",
      active: {
        on: "bg-[#E48FB1] text-[#1E1E2F] md:bg-transparent md:text-[#E48FB1]",
        off: "border-b border-[#3A3A4D] text-[#F4F4F8] hover:bg-[#2A2A3D] md:border-0 md:hover:bg-transparent md:hover:text-[#E48FB1]",
      },
      disabled: {
        on: "text-[#9C9CBA] hover:cursor-not-allowed",
        off: "",
      },
    },

    toggle: {
      base: "inline-flex items-center rounded-lg p-2 text-sm text-[#B3B3C6] hover:bg-[#2A2A3D] focus:outline-none focus:ring-2 focus:ring-[#E48FB1]/30 md:hidden",
      icon: "h-6 w-6 shrink-0",
      title: "sr-only",
    },
  },
  button: {
    base: "font-semibold rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-4",
    color: {
      primary: "bg-[#E48FB1] hover:bg-[#D979A4] text-white focus:ring-pink-300",
      secondary:
        "bg-[#2A2A3D] hover:bg-[#3A3A4D] text-[#F4F4F8] border border-[#3A3A4D]",
    },
    size: {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    },
  },
};
