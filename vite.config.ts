import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/crypto-dashboard/",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react") || id.includes("react-dom")) return "react";
          if (id.includes("react-router")) return "router";
          if (id.includes("recharts") || id.includes("d3")) return "charts";
          if (id.includes("react-icons")) return "icons";
          if (id.includes("zustand") || id.includes("@tanstack")) return "state";

          return "vendor";
        },
      },
    },
  },
});
