import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // serveStatic is only called in production mode
  // The build output is always in dist/public (from vite build)
  const distPath = path.resolve(import.meta.dirname, "../..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Configure static file serving with appropriate cache headers
  // - HTML files: no-cache (always revalidate) to ensure latest version
  // - Assets with hashes: long cache (1 year) since Vite generates unique hashes
  // - Other files: short cache (1 day) with revalidation
  app.use(
    express.static(distPath, {
      maxAge: "1d", // Default cache for 1 day
      etag: true, // Enable ETag for cache validation
      lastModified: true, // Enable Last-Modified header
      setHeaders: (res, filePath) => {
        // HTML files should not be cached (always check for updates)
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        }
        // Assets with hashes (Vite generates unique filenames) can be cached longer
        else if (
          filePath.match(
            /\/assets\/.*-[a-zA-Z0-9]+\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
          )
        ) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable"); // 1 year
        }
        // Other static files: short cache with revalidation
        else {
          res.setHeader(
            "Cache-Control",
            "public, max-age=86400, must-revalidate",
          ); // 1 day
        }
      },
    }),
  );

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    // Ensure index.html is never cached
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
