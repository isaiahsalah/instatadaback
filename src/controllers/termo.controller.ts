import {Request, Response} from "express";
import client from "../database/conexionThermo";
import path from "path";
import fs from "fs";
import {getDefaultWeekRange} from "../utils/functions";

export const getExtrusion = async (req: Request, res: Response): Promise<void> => {
  try {
    const {startDate: queryStartDate, endDate: queryEndDate} = req.query;

    // Obtener fechas predeterminadas si no se proporcionan
    const {startDate, endDate} =
      queryStartDate && queryEndDate
        ? {startDate: queryStartDate, endDate: queryEndDate}
        : getDefaultWeekRange();

    // Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, "../database/termo/extrusion.sql");
    const query = fs.readFileSync(sqlFilePath, "utf8");

    // Ejecutar la consulta con parámetros
    const result = await client.query(query, [startDate, endDate]);
    console.log("☀️☀️☀️", JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error en consulta bruta:", error);
    res.status(500).json({error: "Error al obtener los datos"});
  }
};

export const getCorte = async (req: Request, res: Response): Promise<void> => {
  try {
    const {startDate: queryStartDate, endDate: queryEndDate} = req.query;

    // Obtener fechas predeterminadas si no se proporcionan
    const {startDate, endDate} =
      queryStartDate && queryEndDate
        ? {startDate: queryStartDate, endDate: queryEndDate}
        : getDefaultWeekRange();

    // Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, "../database/termo/corte.sql");
    const query = fs.readFileSync(sqlFilePath, "utf8");

    // Ejecutar la consulta con parámetros
    const result = await client.query(query, [startDate, endDate]);
    console.log("🤞🤞🤞", JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error en consulta bruta:", error);
    res.status(500).json({error: "Error al obtener los datos"});
  }
};
export const getEmbultaje = async (req: Request, res: Response): Promise<void> => {
  try {
    const {startDate: queryStartDate, endDate: queryEndDate} = req.query;

    // Obtener fechas predeterminadas si no se proporcionan
    const {startDate, endDate} =
      queryStartDate && queryEndDate
        ? {startDate: queryStartDate, endDate: queryEndDate}
        : getDefaultWeekRange();

    // Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, "../database/termo/embultaje.sql");
    const query = fs.readFileSync(sqlFilePath, "utf8");

    // Ejecutar la consulta con parámetros
    const result = await client.query(query, [startDate, endDate]);
    console.log("🤞🤞🤞", JSON.stringify(result.rows));
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error en consulta bruta:", error);
    res.status(500).json({error: "Error al obtener los datos"});
  }
};
