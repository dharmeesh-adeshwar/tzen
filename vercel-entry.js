// This file is the new entry point for Vercel
import workerHandler from './dist/server/index.js'; 

// This function is the Vercel Node handler compatibility layer
export default async (req, res) => {
  try {
    // 1. Convert the Vercel Node request (req) into a standard Request object
    const url = new URL(req.url, `https://${req.headers.host}`);
    const request = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers),
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req,
    });

    const dummyEnv = env; 
    const dummyExecutionContext = {
      waitUntil: (promise) => {},
      passThroughOnException: () => {},
    };

    // 3. Call the Hydrogen Worker handler
    const response = await workerHandler.fetch(
      request,
      dummyEnv,
      dummyExecutionContext,
    );

    // 4. Send response back to Vercel
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (response.body) {
      const stream = response.body;
      stream.pipe(res);
    } else {
      res.end();
    }
  } catch (e) {
    console.error('Vercel Handler Crash:', e);
    res.statusCode = 500;
    res.end('Internal Server Error: Failed to run Hydrogen.');
  }
};