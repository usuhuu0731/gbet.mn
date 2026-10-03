import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { basePath } from "./site-config.mjs";
import { gzip } from "node:zlib";
import { promisify } from "node:util";
const compress = promisify(gzip);

const root = path.resolve("site");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".rsc": "text/x-component",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};
export function createStaticServer() {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      if (
        basePath &&
        url.pathname !== basePath &&
        !url.pathname.startsWith(basePath + "/")
      )
        throw Error("Outside base");
      const requested = decodeURIComponent(
        url.pathname.slice(basePath.length) || "/",
      );
      let file = path.resolve(root, "." + requested);
      const relative = path.relative(root, file);
      if (relative.startsWith("..") || path.isAbsolute(relative))
        throw Error("Unsafe path");
      const info = await stat(file);
      if (info.isDirectory()) {
        if (!url.pathname.endsWith("/")) {
          res.writeHead(301, { Location: url.pathname + "/" });
          res.end();
          return;
        }
        file = path.join(file, "index.html");
      }
      let data = await readFile(file);
      const compressed =
        /html|js|css|json|xml|webmanifest|rsc/.test(path.extname(file)) &&
        /\bgzip\b/.test(req.headers["accept-encoding"] || "");
      if (compressed) data = await compress(data);
      res.writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-cache",
        ...(compressed
          ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" }
          : {}),
      });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        await readFile(path.join(root, "404.html")).catch(() => "Not found"),
      );
    }
  });
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = Number(process.env.PORT || 5174);
  createStaticServer().listen(port, "127.0.0.1", () =>
    console.log(`Static preview: http://127.0.0.1:${port}${basePath}/`),
  );
}
