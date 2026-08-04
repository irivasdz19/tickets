//server.js — arranque: servidor HTTP, Socket.IO y listen.

import { createServer } from "node:http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import app from "./app.js";
import { conectarDB } from "./data/db.js";

const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || "API de Tickets";

// Socket.IO se monta sobre el mismo servidor HTTP que Express.
// Sin opción cors: la página de prueba se sirve desde este mismo origen.
const httpServer = createServer(app);
const io = new Server(httpServer);

// Nadie se conecta sin identificarse: mismo JWT que la API REST.
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("No autenticado: falta el token"));
  }

  try {
    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new Error("Token inválido o caducado"));
  }
});

io.on("connection", (socket) => {
  // La sala sale del token, no de lo que diga el cliente.
  socket.join(`usuario:${socket.user.sub}`);

  socket.emit("bienvenida", { msg: "Conectado", rol: socket.user.rol });
});

// Las rutas llegan a io con req.app.get("io"), sin importar este archivo.
app.set("io", io);

await conectarDB();
httpServer.listen(PORT, () => {
  console.log(`${APP_NAME} escuchando en http://localhost:${PORT}`);
});
