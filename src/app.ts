// app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./database/conexionBags";
import client from "./database/conexionBags";
import bolsasRoute from "./routes/bolsas.route";
import termoRoute from "./routes/termo.route";

// Configurar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de ejemplo
app.use("/bolsas", bolsasRoute);
app.use("/termo", termoRoute);

app.get("/", async (req, res) => {
  const result = await client.query(`
    SELECT name,description
    FROM production.production_sector; 
             `);
  res.json(result.rows);
});

export default app;
