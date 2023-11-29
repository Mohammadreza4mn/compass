const WebSocket = require("ws");
const { parse } = require("url");

const wss = new WebSocket.WebSocketServer({ port: 8080 });
const roles = new Map();

wss.on("connection", (ws, req) => {
  const { query } = parse(req.url, true);
  const browserId = query.id;

  if (browserId !== "null" && !roles.has(browserId)) {
    roles.set(browserId, { ws });

    ws.on("message", (message, isBinary) => {
      roles.set(browserId, {
        ...roles.get(browserId),
        windowDetails: JSON.parse(message),
      });

      const userData = Array.from(roles.entries()).map(([key, value]) => ({
        browserId: key,
        windowDetails: value.windowDetails,
      }));

      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(userData), { binary: isBinary });
        }
      });
    });

    ws.on("close", () => {
      roles.delete(browserId);
    });
  } else {
    ws.close();
  }
});
