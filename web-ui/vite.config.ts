import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      // {
      //   find: "@components",
      //   replacement: path.resolve(__dirname, "src/components"),
      // },
      // { find: "@layouts", replacement: path.resolve(__dirname, "src/layouts") },
      // { find: "@pages", replacement: path.resolve(__dirname, "src/pages") },
      // { find: "@routes", replacement: path.resolve(__dirname, "src/routes") },
      // { find: "@stores", replacement: path.resolve(__dirname, "src/stores") },
      // { find: "@widgets", replacement: path.resolve(__dirname, "src/widgets") },
    ],
  },
});
