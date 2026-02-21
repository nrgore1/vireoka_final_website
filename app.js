const http = require('http');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => handle(req, res)).listen(port, '0.0.0.0', () => {
    console.log(`Next.js listening on port ${port}`);
  });
}).catch((err) => {
  console.error('Next.js failed to start:', err);
  process.exit(1);
});
