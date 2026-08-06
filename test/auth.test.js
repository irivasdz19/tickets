import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { conectarDB } from "../src/data/db.js";
import { usuario as Usuario } from "../src/models/usuarios.js";

describe("API de Autenticación y Usuarios (/auth)", () => {
  beforeAll(async () => {
    await conectarDB();
  });

  afterEach(async () => {
    await Usuario.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("POST /auth/registro", () => {
    it("debe registrar un usuario nuevo y devolver código 201", async () => {
      const res = await request(app).post("/auth/registro").send({
        email: "nuevo@correo.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.email).toBe("nuevo@correo.com");
      expect(res.body.rol).toBe("usuario");
      expect(res.body).not.toHaveProperty("passwordHash"); // Nunca debe devolver el hash
    });

    it("debe rechazar el registro y devolver 409 si el email ya existe", async () => {
      await request(app).post("/auth/registro").send({
        email: "duplicado@correo.com",
        password: "password123",
      });

      const res = await request(app).post("/auth/registro").send({
        email: "duplicado@correo.com",
        password: "otrapassword",
      });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe("Ese email ya está registrado");
    });

    it("debe devolver 400 si falta el email o la contraseña", async () => {
      const res = await request(app).post("/auth/registro").send({
        email: "incompleto@correo.com",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("email y password son obligatorios");
    });

    it("debe devolver 400 si la contraseña tiene menos de 8 caracteres", async () => {
      const res = await request(app).post("/auth/registro").send({
        email: "corta@correo.com",
        password: "1234567",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        "La contraseña debe tener al menos 8 caracteres",
      );
    });

    it("debe ignorar el intento de autoconcederse el rol 'admin'", async () => {
      const res = await request(app).post("/auth/registro").send({
        email: "hacker@correo.com",
        password: "password123",
        rol: "admin",
      });

      expect(res.status).toBe(201);
      expect(res.body.rol).toBe("usuario"); // El servidor debe forzar 'usuario'
    });
  });

  describe("POST /auth/login", () => {
    it("debe iniciar sesión con credenciales correctas y devolver un token (200)", async () => {
      await request(app).post("/auth/registro").send({
        email: "login@correo.com",
        password: "password123",
      });

      const res = await request(app).post("/auth/login").send({
        email: "login@correo.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("debe devolver 401 si la contraseña es incorrecta", async () => {
      await request(app).post("/auth/registro").send({
        email: "existe@correo.com",
        password: "password123",
      });

      const res = await request(app).post("/auth/login").send({
        email: "existe@correo.com",
        password: "badpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Credenciales inválidas");
    });

    it("debe devolver 401 si el correo no existe (mismo mensaje de error por seguridad)", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "noexiste@correo.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Credenciales inválidas");
    });

    it("debe permitir iniciar sesión aunque el email se envíe con mayúsculas", async () => {
      await request(app).post("/auth/registro").send({
        email: "mayusculas@correo.com",
        password: "password123",
      });

      const res = await request(app).post("/auth/login").send({
        email: "MAYUSCULAS@CORREO.COM",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
  });

  describe("GET /auth/yo", () => {
    it("debe devolver los datos del usuario si se envía un token válido (200)", async () => {
      await request(app).post("/auth/registro").send({
        email: "perfil@correo.com",
        password: "password123",
      });

      const loginRes = await request(app).post("/auth/login").send({
        email: "perfil@correo.com",
        password: "password123",
      });
      const token = loginRes.body.token;

      const res = await request(app)
        .get("/auth/yo")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe("perfil@correo.com");
      expect(res.body).not.toHaveProperty("passwordHash");
    });

    it("debe denegar el acceso si no se envía un token (401)", async () => {
      const res = await request(app).get("/auth/yo");
      expect(res.status).toBe(401);
    });

    it("debe denegar el acceso si el token es inválido o falso (401)", async () => {
      const res = await request(app)
        .get("/auth/yo")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.falso.falso",
        );

      expect(res.status).toBe(401);
    });
  });
});
