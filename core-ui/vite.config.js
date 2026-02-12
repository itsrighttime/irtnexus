import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import path from "path";

config();

export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,tsx,js,ts}",
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "core-ui",
      fileName: (format) => `core.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-redux", "@reduxjs/toolkit"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-redux": "ReactRedux",
          "@reduxjs/toolkit": "RTK",
        },
        // Preserve CSS module names
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "core.css";
          }
          return assetInfo.name;
        },
      },
    },
    cssCodeSplit: false, // Bundle all CSS into one file
  },
  resolve: {
    alias: {
      "#api": path.resolve(__dirname, "src/api"),
      "#assets": path.resolve(__dirname, "src/assets"),
      "#configs": path.resolve(__dirname, "src/configs"),
      "#constants": path.resolve(__dirname, "src/constants"),
      "#contexts": path.resolve(__dirname, "src/contexts"),
      "#hooks": path.resolve(__dirname, "src/hooks"),
      "#services": path.resolve(__dirname, "src/services"),
      "#store": path.resolve(__dirname, "src/store"),
      "#translations": path.resolve(__dirname, "src/translations"),
      "#utils": path.resolve(__dirname, "src/utils"),
      "#widgets": path.resolve(__dirname, "src/widgets"),
    },
  },
  server: {
    port: process.env.VITE_PORT || 3000,
  },
});
