import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },

      // { find: "@api", replacement: path.resolve(__dirname, "src/api") },
      // { find: "@assets", replacement: path.resolve(__dirname, "src/assets") },
      // { find: "@configs", replacement: path.resolve(__dirname, "src/configs") },
      // {
      //   find: "@constants",
      //   replacement: path.resolve(__dirname, "src/constants"),
      // },
      // {
      //   find: "@contexts",
      //   replacement: path.resolve(__dirname, "src/contexts"),
      // },
      // { find: "@hooks", replacement: path.resolve(__dirname, "src/hooks") },
      // {
      //   find: "@services",
      //   replacement: path.resolve(__dirname, "src/services"),
      // },
      // { find: "@stores", replacement: path.resolve(__dirname, "src/stores") },
      // {
      //   find: "@translations",
      //   replacement: path.resolve(__dirname, "src/translations"),
      // },
      // { find: "@utils", replacement: path.resolve(__dirname, "src/utils") },
      // { find: "@widgets", replacement: path.resolve(__dirname, "src/widgets") },
      // { find: "@types", replacement: path.resolve(__dirname, "src/types") },
    ],
  },
});
