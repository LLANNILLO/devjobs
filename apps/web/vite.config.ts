import tailwindcss from "@tailwindcss/vite";
import adapter from "@sveltejs/adapter-bun";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  plugins: lazyPlugins(() => [
    tailwindcss(),
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },
      adapter: adapter(),
    }),
  ]),
  lint: {
    plugins: ["typescript", "oxc"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
