// index.ts
import app from "./app";
import clientBags from "./database/conexionBags";
import clientThermo from "./database/conexionThermo";

// Obtener el puerto desde las variables de entorno o usar el puerto por defecto
const PORT = Number(process.env.PORT) || 3000;

async function main() {
  await clientBags
    .connect()
    .then(() => console.log("✅ Conexión exitosa a la base de datos Bolsas"))
    .catch((err: any) => console.error("❌ Error de conexión:", err));

  await clientThermo
    .connect()
    .then(() => console.log("✅ Conexión exitosa a la base de datos Termo"))
    .catch((err: any) => console.error("❌ Error de conexión:", err));

  // console.log("✅ Conectado a PostgreSQL Bolsas");

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

main();
