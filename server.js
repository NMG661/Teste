const WebSocket = require("ws");

const PORT = 10000;
const wss = new WebSocket.Server({ port: PORT });

let players = {};

wss.on("connection", (ws) => {
  const playerId = Date.now(); // só pra teste, ID simples
  players[playerId] = { id: playerId };

  console.log(`Novo jogador: ${playerId}`);

  ws.send(JSON.stringify({
    cmd: "joined_server",
    content: { msg: "Bem-vindo!", uuid: playerId }
  }));

  ws.on("message", (msg) => {
    console.log("Recebido:", msg.toString());
    // retransmitir para outros jogadores
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log(`Jogador ${playerId} saiu`);
    delete players[playerId];
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          cmd: "player_disconnected",
          content: { id: playerId }
        }));
      }
    });
  });
});

console.log(`Servidor rodando na porta ${PORT}`);