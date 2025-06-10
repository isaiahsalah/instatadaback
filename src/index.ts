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
/*
// Función para obtener y mostrar el uso de memoria
function mostrarUsoDeMemoria() {
  const memoria = process.memoryUsage();

  console.clear(); // Limpiar la consola para mantener la información actualizada
  console.log("Uso de memoria:");
  console.log(`RSS: ${(memoria.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Heap Total: ${(memoria.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Heap Usado: ${(memoria.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Externos: ${(memoria.external / 1024 / 1024).toFixed(2)} MB`);

  if (memoria.arrayBuffers) {
    console.log(`Buffers de Array: ${(memoria.arrayBuffers / 1024 / 1024).toFixed(2)} MB`);
  }
}

// Ejecutar la función cada segundo
setInterval(mostrarUsoDeMemoria, 1000);*/

main();
