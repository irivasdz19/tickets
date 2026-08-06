// El servicio es el único que habla con el modelo.

import { ticket as Ticket } from "../models/tickets.js";

export const ticketsService = {
  listar: (filtro, { skip, limit, sort }) =>
    Ticket.find(filtro).sort(sort).skip(skip).limit(limit),

  contar: (filtro) => Ticket.countDocuments(filtro),

  obtener: (id) => Ticket.findById(id),

  crear: (datos) => Ticket.create(datos),

  actualizar: (id, cambios) =>
    Ticket.findByIdAndUpdate(id, cambios, { new: true, runValidators: true }),

  eliminar: (id) => Ticket.findByIdAndDelete(id),
};
