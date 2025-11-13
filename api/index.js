// Import from the built server file instead of source

// The build process resolves the virtual:react-router/server-build import

import handler from '../dist/server/index.js';



export default {

  fetch: handler.fetch,

};