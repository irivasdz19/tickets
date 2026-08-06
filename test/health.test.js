import request from "supertest";
import app from "../src/app.js";

test("GET /health responde 200 y { status: 'ok' }", async () => {
  const res = await request(app).get("/health");

  expect(res.status).toBe(200);
  expect(res.body).toEqual({ status: "ok" });
});
