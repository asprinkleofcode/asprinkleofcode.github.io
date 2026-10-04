import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

// The flowbite-react plugin regenerates `.flowbite-react/` and keeps a watcher
// open, which stops `vitest run` from exiting; tests don't need it.
const isVitest = process.env.VITEST === "true";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ...(isVitest ? [] : [flowbiteReact()])],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});
