//Controlador lee la peticion y responde usando el servicio
import mongoose from "mongoose";
import { ticketsService } from "../services/tickets.service.js";
import { ESTADOS, PRIORIDADES } from "../models/tickets.js";
import { detallesDeValidacion } from "../middlewares/errores.js";

const CAMPOS_ORDENABLES = [
  "titulo",
  "estado",
  "prioridad",
  "createdAt",
  "updatedAt",
];
const LIMITE_MAXIMO = 100;

// GET /tickets -> listado con paginación, filtros y ordenación
export async function listar(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      estado,
      prioridad,
      sort = "-createdAt",
    } = req.query;

    const pagina = Number(page);
    const porPagina = Number(limit);

    if (!Number.isInteger(pagina) || pagina < 1) {
      return res
        .status(400)
        .json({ error: "page debe ser un entero mayor o igual a 1" });
    }

    if (
      !Number.isInteger(porPagina) ||
      porPagina < 1 ||
      porPagina > LIMITE_MAXIMO
    ) {
      return res
        .status(400)
        .json({ error: `limit debe ser un entero entre 1 y ${LIMITE_MAXIMO}` });
    }

    if (estado && !ESTADOS.includes(estado)) {
      return res.status(400).json({
        error: `estado inválido. Valores permitidos: ${ESTADOS.join(", ")}`,
      });
    }

    if (prioridad && !PRIORIDADES.includes(prioridad)) {
      return res.status(400).json({
        error: `prioridad inválida. Valores permitidos: ${PRIORIDADES.join(", ")}`,
      });
    }

    // sort admite "campo" (ascendente) o "-campo" (descendente)
    const campoOrden = typeof sort === "string" ? sort.replace(/^-/, "") : "";
    if (!CAMPOS_ORDENABLES.includes(campoOrden)) {
      return res.status(400).json({
        error: `sort inválido. Campos permitidos: ${CAMPOS_ORDENABLES.join(", ")}`,
      });
    }

    const filtro = {};
    if (estado) filtro.estado = estado;
    if (prioridad) filtro.prioridad = prioridad;

    const [tickets, total] = await Promise.all([
      ticketsService.listar(filtro, {
        skip: (pagina - 1) * porPagina,
        limit: porPagina,
        sort,
      }),
      ticketsService.contar(filtro),
    ]);

    res.json({ total, page: pagina, limit: porPagina, tickets });
  } catch (error) {
    next(error);
  }
}

// GET /tickets/:id -> un ticket
export async function obtener(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ error: "El id no tiene un formato válido de MongoDB" });
    }

    const ticketDb = await ticketsService.obtener(req.params.id);

    if (!ticketDb) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(ticketDb);
  } catch (error) {
    next(error);
  }
}

// POST /tickets -> crear
export async function crear(req, res, next) {
  try {
    const { titulo, estado, prioridad } = req.body;

    const ticketNuevo = await ticketsService.crear({
      titulo,
      estado,
      prioridad,
    });

    // io se saca de req.app, así que avisar es cosa del controlador
    const io = req.app.get("io");
    io?.emit("ticket:creado", ticketNuevo); // a todos
    io?.to(`usuario:${req.user.sub}`).emit("ticket:confirmado", ticketNuevo); // solo al creador

    res.status(201).json(ticketNuevo);
  } catch (error) {
    // Datos mal enviados por el cliente: 400, no 500
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Datos inválidos",
        detalles: detallesDeValidacion(error),
      });
    }
    next(error);
  }
}

// PATCH /tickets/:id -> actualizar parcialmente
export async function actualizar(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ error: "El id no tiene un formato válido de MongoDB" });
    }

    // Solo tocamos los campos que vengan en el cuerpo
    const { titulo, estado, prioridad } = req.body;
    const cambios = {};
    if (titulo !== undefined) cambios.titulo = titulo;
    if (estado !== undefined) cambios.estado = estado;
    if (prioridad !== undefined) cambios.prioridad = prioridad;

    if (Object.keys(cambios).length === 0) {
      return res
        .status(400)
        .json({ error: "Envía al menos un campo: titulo, estado o prioridad" });
    }

    const ticketDb = await ticketsService.actualizar(req.params.id, cambios);

    if (!ticketDb) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    req.app.get("io")?.emit("ticket:actualizado", ticketDb);

    res.json(ticketDb);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Datos inválidos",
        detalles: detallesDeValidacion(error),
      });
    }
    next(error);
  }
}

// DELETE /tickets/:id -> eliminar
export async function eliminar(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ error: "El id no tiene un formato válido de MongoDB" });
    }

    const ticketDb = await ticketsService.eliminar(req.params.id);

    if (!ticketDb) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.status(204).end(); // éxito sin cuerpo
  } catch (error) {
    next(error);
  }
}
