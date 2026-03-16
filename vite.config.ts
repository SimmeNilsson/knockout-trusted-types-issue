import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            knockout: path.resolve(__dirname, "node_modules/knockout/build/output/knockout-latest.debug.js")
        }
    }
});
