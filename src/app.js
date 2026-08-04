// La aplicación Express, sin arrancar nada.
// El arranque (servidor HTTP, Socket.IO y listen) vive en server.js.

import express from "express";
import ticketsRouter from "./routes/tickets.js";
import authRouter from "./routes/auth.js";
import { noEncontrado, manejadorErrores } from "./middlewares/errores.js";

const app = express();
const APP_NAME = process.env.APP_NAME || "API de Tickets";

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Indice del server
app.get("/", (req, res) =>
  res.json({
    nombre: APP_NAME,
    endpoints: ["/tickets", "/auth", "/health", "/version"],
  }),
);

// Página de prueba de Socket.IO, disponible en /index.html.
// Va DESPUÉS del índice para que la raíz siga devolviendo JSON: esto es una API.
app.use(express.static("public"));

// Salud del server
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/version", (req, res) => res.json({ version: "1.0.0" }));

// Routers
app.use("/auth", authRouter);
app.use("/tickets", ticketsRouter);

// Errores
app.use(noEncontrado);
app.use(manejadorErrores);

export default app;
