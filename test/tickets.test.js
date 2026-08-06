import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { conectarDB } from "../src/data/db.js";
import { ticket as Ticket } from "../src/models/tickets.js";
import { firmarToken } from "../src/middlewares/auth.js";

const tokenAdmin = firmarToken({
  _id: new mongoose.Types.ObjectId(),
  rol: "admin",
});

const tokenUsuario = firmarToken({
  _id: new mongoose.Types.ObjectId(),
  rol: "usuario",
});

describe("API de Tickets - Seguridad y Roles", () => {
  beforeAll(async () => {
    await conectarDB();
  });

  afterEach(async () => {
    await Ticket.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("DELETE /tickets/:id", () => {
    it("debe permitir a un ADMIN eliminar un ticket (200 o 204)", async () => {
      const ticketPrueba = await Ticket.create({
        titulo: "Ticket para borrar",
        estado: "abierto",
        prioridad: "media",
      });

      // Petición con token de administrador
      const res = await request(app)
        .delete(`/tickets/${ticketPrueba._id}`)
        .set("Authorization", `Bearer ${tokenAdmin}`);

      // Verificamos respuesta exitosa
      expect([200, 204]).toContain(res.status);

      // Confirmamos que el service Ticket.findByIdAndDelete hizo su trabajo
      const ticketBorrado = await Ticket.findById(ticketPrueba._id);
      expect(ticketBorrado).toBeNull();
    });

    it("debe bloquear a un USUARIO NORMAL intentando eliminar un ticket (403)", async () => {
      const ticketPrueba = await Ticket.create({
        titulo: "Ticket intocable",
        estado: "abierto",
        prioridad: "media",
      });

      // Petición con token de usuario estándar
      const res = await request(app)
        .delete(`/tickets/${ticketPrueba._id}`)
        .set("Authorization", `Bearer ${tokenUsuario}`);

      expect(res.status).toBe(403);

      const ticketIntacto = await Ticket.findById(ticketPrueba._id);
      expect(ticketIntacto).not.toBeNull();
      expect(ticketIntacto.titulo).toBe("Ticket intocable");
    });
  });
});
