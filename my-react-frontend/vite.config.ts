import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	root: "./src",
	plugins: [react(), reactRefresh(), splitVendorChunkPlugin()],
	build: {
		outDir: '../public'
	  }
});
