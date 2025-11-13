// Prefer the built server bundle (dist/server/index.js) when available on the host.
// Fall back to the source `server.js` handler for local/dev scenarios.
let handler;
try {
  // Top-level await is supported in ESM — Vercel's Node builder will run this at build/runtime.
  // The built output exports the handler as the default export.
  handler = (await import('../dist/server/index.js')).default;
} catch (e) {
  // If the built bundle isn't present (for example, local dev without a build), use server.js
  handler = (await import('../server.js')).default;
}

export default {
  fetch: handler.fetch,
};
