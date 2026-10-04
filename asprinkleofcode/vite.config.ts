import { defineConfig } from "vitest/config";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import contentFrontmatter from "./plugins/contentFrontmatter";

// The flowbite-react plugin regenerates `.flowbite-react/` and keeps a watcher
// open, which stops `vitest run` from exiting; tests don't need it.
const isVitest = process.env.VITEST === "true";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Validates and strips frontmatter before MDX compiles the body.
    contentFrontmatter(),
    { enforce: "pre", ...mdx() },
    react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
    tailwindcss(),
    ...(isVitest ? [] : [flowbiteReact()]),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});
