import { Request, Response } from "express";

import { Corte_PA, Corte_PO } from "../models/corte.model";
import { corte_pa, corte_po } from "../database/corte.query";

export const postCorteAvancedOrder = async (
  req: Request,
  res: Response
) => {
  const { from, to } = req.body;
  const dateFrom = new Date(from);
  const dateTo = new Date(to);

  try {
    const result_pa: Corte_PA[] | undefined = await corte_pa({
      from: dateFrom,
      to: dateTo,
    });
    const result_po: Corte_PO[] | undefined = await corte_po({
      from: dateFrom,
      to: dateTo,
    });
    const turnLine = [
      { turno: "Dia"},
      { turno: "Noche" },
    ];

    if (result_pa === undefined || result_po === undefined) return;

    //console.log(result_pa);

    const data = turnLine.map((item) => {
      // Buscar los datos de producción
      const turn_pa = result_pa.find(
        (p: { turno: string}) =>
          p.turno === item.turno 
      ) || { avance: 0 };
      // Buscar los datos de objetivos
      const turn_po = result_po.find(
        (o: { turno: string }) =>
          o.turno === item.turno 
      ) || { objetivo: 0 }; 

      //console.log(productionData.acumulado + productionData.mala);
      // Cálculo de Promedio
      const promedio = turn_po.objetivo > 0
          ? Math.round(
              (turn_pa.avance / turn_po.objetivo) * 100 * 100
            ) / 100
          : 0; ;
      

      // Crear el objeto con los resultados calculados
      return {
        turno: item.turno,
        avance: turn_pa.avance,
        objetivo: turn_po.objetivo,
        promedio,
      };
    });

    //console.log(data);

    res.json(data);
  } catch (error) {
    console.error("❌ Error en consulta bruta:", error);
    res.status(500).json({ error: "Error al obtener los datos" });
  }
};
