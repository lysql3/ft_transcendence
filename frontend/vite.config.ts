import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // needed if you run the dev server in Docker
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000/",
    },
  },
});
