import vinext from "vinext";
import { defineConfig } from "vite";
import {basePath,origin} from "./scripts/site-config.mjs";
export default defineConfig({base:basePath + "/",plugins:[vinext()], define:{__GBET_BASE_PATH__:JSON.stringify(basePath),__GBET_SITE_ORIGIN__:JSON.stringify(origin)}});
