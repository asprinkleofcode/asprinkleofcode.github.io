import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import contentFrontmatter from "./plugins/contentFrontmatter";

// The flowbite-react plugin regenerates `.flowbite-react/` and keeps a watcher
// open, which stops `vitest run` from exiting; tests don't need it.
const isVitest = process.env.VITEST === "true";

// `?raw`/`?url` imports want the file as it is (the AD-10 source scan reads stories raw).
// @mdx-js/rollup drops the query before its include/exclude filter, so skip them here.
const RAW_IMPORT = /\?(?:.*&)?(?:raw|url)(?:[=&]|$)/;
function mdxSkippingRawImports(): Plugin {
  const plugin = mdx() as Plugin;
  const transform = plugin.transform as Extract<Plugin["transform"], (...args: never[]) => unknown>;
  return {
    ...plugin,
    transform(code, id, options) {
      return RAW_IMPORT.test(id) ? null : transform.call(this, code, id, options);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Validates and strips frontmatter before MDX compiles the body.
    contentFrontmatter(),
    { enforce: "pre", ...mdxSkippingRawImports() },
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
