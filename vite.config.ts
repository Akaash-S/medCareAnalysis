import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//@ts-ignore
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dev mode check for Replit
const isDev = process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined;

export default defineConfig(async () => {
  const devPlugins = [];

  if (isDev) {
    //@ts-ignore
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    devPlugins.push(cartographer());
  }

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...devPlugins,
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client/src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "server/public"),
      emptyOutDir: true,
      chunkSizeWarningLimit: 10000,
    },
  };
});
