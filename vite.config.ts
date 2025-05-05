import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { compression } from "vite-plugin-compression2";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), compression({ threshold: 10240 })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 8080,
  },
});
