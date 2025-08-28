const WebSocket = require("ws");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

// Lista de jogadores (exemplo simples, pode ser substituído pelo seu módulo)
const playerlist = require("./playerlist.js"); // deve ter add(uuid), get(uuid), getAll()

// Servidor HTTP (se quiser usar Express)
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Servidor WebSocket
const wss = new WebSocket.Server({ server });

// Função para gerar UUID
const { v4: uuidv4 } = require("uuid");

wss.on("connection", async (ws) => {
  console.log("Novo jogador conectado!");

  // Criar novo jogador
  const playerUUID = uuidv4();
  await playerlist.add(playerUUID);
  const newPlayer = await playerlist.get(playerUUID);

  // Enviar UUID ao cliente
  ws.send(JSON.stringify({
    cmd: "joined_server",
    content: { msg: "Bem-vindo ao servidor!", uuid: playerUUID }
  }));

  // Enviar todos os outros jogadores ao novo cliente
  const allPlayers = await playerlist.getAll();
  ws.send(JSON.stringify({
    cmd: "spawn_network_players",
    content: { msg: "Spawning network players!", players: allPlayers }
  }));

  // Enviar o jogador local para ele mesmo
  ws.send(JSON.stringify({
    cmd: "spawn_local_player",
    content: { msg: "Spawning local (you) player!", player: newPlayer }
  }));

  // Receber mensagens do cliente
  ws.on("message", (message) => {
    console.log("Recebido:", message.toString());

    // Repassar mensagem para todos os outros jogadores conectados
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log(`Jogador ${playerUUID} desconectou.`);
    playerlist.remove(playerUUID); // remover da lista
    // Avisar todos os outros players
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          cmd: "player_disconnected",
          content: { id: playerUUID }
        }));
      }
    });
  });
});