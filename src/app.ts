// app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./database/conexion";
import client from "./database/conexion";
import extrusionRoute from "./routes/extrusion.route";
import corteRoute from "./routes/corte.route";
import impresionRoute from "./routes/impresion.route";

// Configurar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de ejemplo

app.use("/extrusion", extrusionRoute);
app.use("/corte", corteRoute);
app.use("/impresion", impresionRoute);
app.get("/example", async (req, res) => {
  const result = await client.query(`
    SELECT P.name FROM  production.production_sector P  ; 
             `);
  res.json(result.rows);
});

// Conectar a la base de datos
client
  .connect()
  .then(() => console.log("✅ Conexión exitosa a la base de datos"))
  .catch((err: any) => console.error("❌ Error de conexión:", err));
/*
sequelize
  .authenticate()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => console.error("❌ Error de conexión:", err));
*/
export default app;
