import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), vanillaExtractPlugin()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
    clearScreen: false,
    server: {
        port: 3000,
        strictPort: true,
    },
    envPrefix: ["VITE_"],
    build: {
        minify: "esbuild",
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ["react", "react-dom"],
                },
            },
        },
        sourcemap: true,
    },
})
