import {Sequelize} from "sequelize";
import dotenv from "dotenv";
const {Client} = require("pg");

dotenv.config(); // Cargar variables de entorno
/*
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: Number(process.env.DB_PORT) || 5432,
    logging: false, // Evita mostrar logs de SQL
  }
);

export default sequelize;
*/

// Crear un cliente para la base de datos usando las variables de entorno
const clientBags = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME_BAGS,
});

export default clientBags;
