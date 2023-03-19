const decoder = new TextDecoder("utf-8");
const certRaw = Deno.readFileSync("./cert.pem");
const cert = decoder.decode(certRaw);
const keyRaw = Deno.readFileSync("./privkey.pem");
const key = decoder.decode(keyRaw);

// Start listening on port 8080 of localhost.
const server = Deno.listenTls({ port: 443, cert, key, alpnProtocols: ["h2", "http/1.1"] });
console.log(`HTTP webserver running.  Access it at:  https://localhost.notfounds.xyz/`);

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
  // In order to not be blocking, we need to handle each connection individually
  // without awaiting the function
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
  // This "upgrades" a network connection into an HTTP connection.
  const httpConn = Deno.serveHttp(conn);
  // Each request sent over the HTTP connection will be yielded as an async
  // iterator from the HTTP connection.
  for await (const requestEvent of httpConn) {
    // The native HTTP server uses the web standard `Request` and `Response`
    // objects.
    const body = `Your user-agent is:\n\n${
      requestEvent.request.headers.get("user-agent") ?? "Unknown"
    }`;
    // The requestEvent's `.respondWith()` method is how we send the response
    // back to the client.
    requestEvent.respondWith(
      new Response(body, {
        status: 200,
      }),
    );
  }
}
