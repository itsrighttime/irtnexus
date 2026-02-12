import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import path from "path";

config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "#components": path.resolve(__dirname, "src/components"),
      "#constants": path.resolve(__dirname, "src/constants"),
      "#configs": path.resolve(__dirname, "src/configs"),
      "#layouts": path.resolve(__dirname, "src/layouts"),
      "#pages": path.resolve(__dirname, "src/pages"),
      "#routes": path.resolve(__dirname, "src/routes"),
      "#stores": path.resolve(__dirname, "src/stores"),
      "#translations": path.resolve(__dirname, "src/translations"),
      "#utils": path.resolve(__dirname, "src/utils"),
      "#widgets": path.resolve(__dirname, "src/widgets"),
    },
  },
  server: {
    port: process.env.VITE_PORT || 3000,
  },
});
