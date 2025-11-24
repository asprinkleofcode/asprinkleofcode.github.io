export const aSprinkleOfCodeTheme = {
  navbar: {
    root: {
      base: "bg-[var(--color-dark-800)] px-2 py-2.5 sm:px-4 border-b border-[var(--color-dark-600)]",
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
      base: "flex items-center space-x-3 text-[var(--color-primary-400)] font-bold",
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
        on: "bg-[var(--color-primary-400)] text-[var(--color-dark-800)] md:bg-transparent md:text-[var(--color-primary-400)]",
        off: "border-b border-[var(--color-dark-600)] text-[var(--color-dark-50)] hover:bg-[var(--color-dark-700)] md:border-0 md:hover:bg-transparent md:hover:text-[var(--color-primary-400)]",
      },
      disabled: {
        on: "text-[var(--color-dark-300)] hover:cursor-not-allowed",
        off: "",
      },
    },

    toggle: {
      base: "inline-flex items-center rounded-lg p-2 text-sm text-[var(--color-dark-300)] hover:bg-[var(--color-dark-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-400)]/30 md:hidden",
      icon: "h-6 w-6 shrink-0",
      title: "sr-only",
    },
  },
  footer: {
    root: {
      base: "w-full rounded-none bg-[var(--color-dark-800)] shadow-inner md:flex md:items-center md:justify-between",
      container: "w-full p-6 mx-auto",
      bgDark: "bg-[var(--color-dark-800)]",
    },
    brand: {
      base: "mb-4 flex items-center sm:mb-0",
      img: "mr-3 h-8 drop-shadow-[0_0_6px_[var(--color-primary-400)]]",
      span: "self-center whitespace-nowrap text-2xl font-semibold text-[var(--color-dark-50)] tracking-wide",
    },
    groupLink: {
      base: "flex flex-wrap text-sm text-gray-300",
      link: {
        base: "me-4 last:mr-0 md:mr-6 transition duration-200",
        href: "hover:text-[var(--color-primary-400)] hover:drop-shadow-[0_0_6px_[var(--color-primary-400)]] hover:underline",
      },
      col: "flex-col space-y-4 text-gray-300",
    },
    icon: {
      base: "text-gray-400 transition duration-200 hover:text-[var(--color-primary-400)] hover:drop-shadow-[0_0_6px_[var(--color-primary-400)]]",
      size: "h-5 w-5",
    },
    title: {
      base: "mb-6 text-sm font-semibold uppercase text-gray-400 tracking-widest",
    },
    divider: {
      base: "my-6 w-full border-gray-700 sm:mx-auto lg:my-8",
    },
    copyright: {
      base: "text-sm text-gray-400",
      href: "ml-1 hover:text-[var(--color-primary-400)] hover:underline",
      span: "ml-1 text-[var(--color-primary-400)]",
    },
  },
  button: {
    base: "font-semibold rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-4",
    color: {
      primary:
        "bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white focus:ring-[var(--color-primary-200)]",
      secondary:
        "bg-[var(--color-dark-700)] hover:bg-[var(--color-dark-500)] text-[var(--color-dark-50)] border border-[var(--color-dark-600)]",
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
      bordered: "p-1 ring-2 ring-white",
      rounded: "rounded-full",
      color: {
        dark: "ring-gray-800 dark:ring-gray-800",
        failure: "ring-red-500 dark:ring-red-700",
        gray: "ring-gray-500 dark:ring-gray-400",
        info: "ring-cyan-400 dark:ring-cyan-800",
        light: "ring-gray-300 dark:ring-gray-500",
        purple: "ring-purple-500 dark:ring-purple-600",
        success: "ring-green-500 dark:ring-green-500",
        warning: "ring-yellow-300 dark:ring-yellow-500",
        pink: "ring-pink-500 dark:ring-pink-500",
      },
      img: {
        base: "rounded transition-all duration-300",
        off: "relative overflow-hidden bg-gray-100 dark:bg-gray-600",
        on: "",
        placeholder: "absolute -bottom-1 h-auto w-auto text-gray-400",
      },
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-20 w-20",
        xl: "h-36 w-36",
      },
      stacked: "ring-2 ring-gray-300 dark:ring-gray-500",
      statusPosition: {
        "bottom-left": "-bottom-1 -left-1",
        "bottom-center": "-bottom-1",
        "bottom-right": "-bottom-1 -right-1",
        "top-left": "-left-1 -top-1",
        "top-center": "-top-1",
        "top-right": "-right-1 -top-1",
        "center-right": "-right-1",
        center: "",
        "center-left": "-left-1",
      },
      status: {
        away: "bg-yellow-400",
        base: "absolute h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800",
        busy: "bg-red-400",
        offline: "bg-gray-400",
        online: "bg-green-400",
      },
      initials: {
        text: "font-medium text-gray-600 dark:text-gray-300",
        base: "relative inline-flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-600",
      },
    },
    group: {
      base: "flex -space-x-4",
    },
    groupCounter: {
      base: "relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-xs font-medium text-white ring-2 ring-gray-300 hover:bg-gray-600 dark:ring-gray-500",
    },
  },
};
