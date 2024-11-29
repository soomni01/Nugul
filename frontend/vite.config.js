import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
      },
      // "/ws-chat": {
      //   target: "ws://localhost:8080",
      //   ws: true, // WebSocket 프록시
      //   changeOrigin: true,
      // },
    },
  },
});
