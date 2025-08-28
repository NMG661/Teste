const WebSocket = require("wss");

const PORT = process.env.PORT || 10000;
const wss = new WebSocket.Server({ port: PORT });
const uuid = v4();
await playerlist.add(uuid);
const newPlayer = await playerlist.get(uuid);
const wss = new WebSocket.Server({ server });
const playerlist = require("./playerlist.js");
const server = app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT);
});


wss.on("connection", (ws) => {
  console.log("Novo jogador conectado!");

  ws.on("message", (message) => {
    console.log("Recebido:", message.toString());

    // Enviar UUID ao cliente
    socket.send(JSON.stringify({
        cmd: "joined_server",
        content: { msg: "Bem-vindo ao servidor!", uuid }
    }));
    
        // Enviar todos os outros jogadores ao novo cliente
    socket.send(JSON.stringify({
        cmd: "spawn_network_players",
        content: {
            msg: "Spawning network players!",
            players: await playerlist.getAll()
    
            // Enviar jogador local
    socket.send(JSON.stringify({
        cmd: "spawn_local_player",
        content: { msg: "Spawning local (you) player!", player: newPlayer }
    }));  
          
    // envia a mensagem para todos os jogadores conectados
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});

console.log(`Servidor rodando na porta ${PORT}`);