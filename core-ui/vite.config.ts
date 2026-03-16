import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // dts({
    //   rollupTypes: true,
    //   exclude: ["vite.config.ts", "node_modules/**"], // exclude config
    // }),
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "CoreUi",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => `core-ui.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
