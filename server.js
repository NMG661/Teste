const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;
const wss = new WebSocket.Server({ port: PORT });

wss.on("connection", (ws) => {
  console.log("Novo jogador conectado!");

  ws.on("message", (message) => {
    console.log("Recebido:", message.toString());

    // envia a mensagem para todos os jogadores conectados
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});

console.log(`Servidor rodando na porta ${PORT}`);