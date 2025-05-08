// index.ts
import app from "./app";
import client from "./database/conexion";

// Obtener el puerto desde las variables de entorno o usar el puerto por defecto
const PORT = Number(process.env.PORT) || 3000;

async function main() {
  await client
    .connect()
    .then(() => console.log("✅ Conexión exitosa a la base de datos"))
    .catch((err: any) => console.error("❌ Error de conexión:", err));
  console.log("✅ Conectado a PostgreSQL");

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

main();
