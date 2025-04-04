// index.ts
import app from './app';

// Obtener el puerto desde las variables de entorno o usar el puerto por defecto
const PORT =  Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


