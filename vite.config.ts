import vinext from "vinext";
import { defineConfig } from "vite";
const repo = process.env.GBET_REPOSITORY;
if (!repo || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) throw new Error("Set GBET_REPOSITORY to owner/repository");
const [owner, name] = repo.split("/");
const basePath = name === `${owner}.github.io` ? "" : `/${name}`;
export default defineConfig({base:basePath + "/",plugins:[vinext()], define:{__GBET_BASE_PATH__:JSON.stringify(basePath),__GBET_SITE_ORIGIN__:JSON.stringify(`https://${owner}.github.io${basePath}`)}});
