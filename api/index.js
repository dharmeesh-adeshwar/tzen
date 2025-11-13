// New content for api/index.js (The Vercel Node Compatibility Layer)

// 1. Import the bundled Worker handler from your build output
import workerHandler from '../dist/server/index.js'; 

// 2. Export a Vercel-compatible Node.js request handler (req, res)
export default async (req, res) => {
  try {
    // 3. Convert the Vercel Node request (req) into a standard Request object
    const url = new URL(req.url, `https://${req.headers.host}`);
    const request = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers),
      // Pass the streamable request body for non-GET/HEAD methods
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req,
    });

    // 4. Create dummy environment and execution context (Worker-style arguments)
    const dummyEnv = process.env; 
    const dummyExecutionContext = {
      waitUntil: (promise) => {},
      passThroughOnException: () => {},
    };

    // 5. Call the original Worker fetch handler
    const response = await workerHandler.fetch(
      request,
      dummyEnv,
      dummyExecutionContext,
    );

    // 6. Transfer response headers and body to the Vercel response (res)
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Pipe the response body stream back to Vercel
    if (response.body) {
      const stream = response.body;
      stream.pipe(res);
    } else {
      res.end();
    }
  } catch (e) {
    console.error('Vercel Node Handler Error:', e);
    res.statusCode = 500;
    res.end('Internal Server Error: Failed to run Hydrogen worker logic.');
  }
};