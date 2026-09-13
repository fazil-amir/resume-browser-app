import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4040,
    strictPort: true,
    watch: {
      // Resume PDFs and the small JSON stores are backend data, not frontend
      // source. Ignoring them keeps Vite from opening a watcher for every file.
      ignored: ["**/resumes/**", "**/data/**", "**/dist/**"]
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
