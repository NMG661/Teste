const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const playerlist = require("./playerlist.js"); // add, get, getAll, remove

const PORT = 10000;
const wss = new WebSocket.Server({ port: PORT });

console.log(`Servidor rodando na porta ${PORT}`);

wss.on("connection", async (ws) => {
  console.log("Novo jogador conectado!");

  const playerUUID = uuidv4();
  await playerlist.add(playerUUID);
  const newPlayer = await playerlist.get(playerUUID);

  ws.send(JSON.stringify({ cmd: "joined_server", content: { uuid: playerUUID } }));
  ws.send(JSON.stringify({ cmd: "spawn_network_players", content: { players: await playerlist.getAll() } }));
  ws.send(JSON.stringify({ cmd: "spawn_local_player", content: { player: newPlayer } }));

  ws.on("message", (msg) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  ws.on("close", async () => {
    await playerlist.remove(playerUUID);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ cmd: "player_disconnected", content: { id: playerUUID } }));
      }
    });
  });
});