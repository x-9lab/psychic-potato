import { getThemeVariables } from "antd/dist/theme";
import { resolve as pathResolve, join } from "path";
import importus from "vite-plugin-importus";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const AppComponentsPath = join(__dirname, "src", "components");

// https://vitejs.dev/config/
export default defineConfig({
    "plugins": [
        importus([
            {
                "libraryName": "antd"
                , "libraryDirectory": "es"
                , "style": true
            }
        ])
        , react()
    ]
    , "build": {
        "rollupOptions": {
            "output": {
                manualChunks(id) {
                    switch (true) {
                        case /[\\/]node_modules[\\/][_|@]?ant[d]?(.*)/.test(id):
                            return "chunk-vision";

                        case /[\\/]node_modules[\\/]@antv(.*)/.test(id):
                            return "chunk-chart";

                        case /[\\/]node_modules[\\/]react(.*)/.test(id):
                            return "chunk-react";

                        case id.startsWith(AppComponentsPath):
                            return "chunk-app-components";
                    }
                    if (/[\\/]node_modules[\\/]/.test(id)) {
                        return "chunk-libs";
                    }
                }
            }
        }
    }
    , "resolve": {
        "alias": {
            "@": pathResolve(process.cwd(), "src")
            , "@components": pathResolve(process.cwd(), "src", "components")
            , "@utils": pathResolve(process.cwd(), "src", "utils")
            , "@consts": pathResolve(process.cwd(), "src", "consts")
            , "@pages": pathResolve(process.cwd(), "src", "pages")
            , "@config": pathResolve(process.cwd(), "src", "@config")
        }
    }
    , "css": {
        "preprocessorOptions": {
            "less": {
                "modifyVars": getThemeVariables({
                    "dark": true
                })
                , "javascriptEnabled": true
            }
        }
    }
});
