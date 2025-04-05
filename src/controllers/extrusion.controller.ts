import { Request, Response } from "express";
import client from "../database/conexion";
import {
  productionAdvance,
  productionOrder,
} from "../database/extrusion.query";
import { Extrusion_PA, Extrusion_PO } from "../models/extrusion.corte";

export const postExtrusionAvancedOrder = async (
  req: Request,
  res: Response
) => {
  const { from, to } = req.body;
  const dateFrom = new Date(from);
  const dateTo = new Date(to);

  try {
    const result_pa: Extrusion_PA[] | undefined = await productionAdvance({
      from: dateFrom,
      to: dateTo,
    });
    const result_po: Extrusion_PO[] | undefined = await productionOrder({
      from: dateFrom,
      to: dateTo,
    });
    const turnLine = [
      { turno: "Dia", linea: 1 },
      { turno: "Dia", linea: 2 },
      { turno: "Dia", linea: 3 },
      { turno: "Dia", linea: 4 },
      { turno: "Noche", linea: 1 },
      { turno: "Noche", linea: 2 },
      { turno: "Noche", linea: 3 },
      { turno: "Noche", linea: 4 },
    ];

    if (result_pa === undefined || result_po === undefined) return;

    //console.log(result_pa);

    const data = turnLine.map((item) => {
      // Buscar los datos de producción
      const productionData = result_pa.find(
        (p: { turno: string; linea: number }) =>
          p.turno === item.turno && p.linea === item.linea
      ) || { acumulado: 0, mala: 0 };
      // Buscar los datos de objetivos
      const objectiveData = result_po.find(
        (o: { turno: string; linea: number }) =>
          o.turno === item.turno && o.linea === item.linea
      ) || { objetivo: 0 };

      // Cálculos de Cumplimiento
      const cumplimiento =
        objectiveData.objetivo > 0
          ? Math.round(
              (productionData.acumulado / objectiveData.objetivo) * 100 * 100
            ) / 100
          : 0;

      // Cálculos de Calidad
      const calidad =
        productionData.acumulado + productionData.mala > 0
          ? Math.round(
              (productionData.acumulado /
                (productionData.acumulado + productionData.mala)) *
                100 *
                100
            ) / 100
          : 0;
      //console.log(productionData.acumulado + productionData.mala);
      // Cálculo de Promedio
      const promedio = Number((Number((cumplimiento + calidad).toFixed(2)) / 2).toFixed(2) ) ;
      

      // Crear el objeto con los resultados calculados
      return {
        turno: item.turno,
        linea: item.linea,
        acumulado: productionData.acumulado,
        objetivo: objectiveData.objetivo,
        mala: productionData.mala,
        cumplimiento,
        calidad,
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

/*

const { Op, fn, col, literal } = require('sequelize');
const { ProductionAdvance } = require('./models'); // Adjust the path as necessary

async function getProductionData() {
const results = await ProductionAdvance.findAll({
attributes: [
'turn_type_name AS Turno',
[literal(`CASE
WHEN machine_name IN ('EXTRUSORA 1', 'EXTRUSORA 2', 'EXTRUSORA 3', 'EXTRUSORA 11 RAYADA', 'EXTRUSORA 4', 'EXTRUSORA 5', 'EXTRUSORA 6 RAYADA', 'EXTRUSORA 46', 'EXTRUSORA 7 RAYADA', 'EXTRUSORA 8', 'EXTRUSORA 9', 'EXTRUSORA 47', 'EXTRUSORA 10', 'EXTRUSORA 12', 'EXTRUSORA 54') THEN 'Linea 1'
WHEN machine_name IN ('EXTRUSORA 13 RAYADA', 'EXTRUSORA 14 RAYADA', 'EXTRUSORA 15', 'EXTRUSORA 16', 'EXTRUSORA 48', 'EXTRUSORA 49', 'EXTRUSORA 17', 'EXTRUSORA 18 RAYADA', 'EXTRUSORA 19 RAYADA', 'EXTRUSORA 20 PP', 'EXTRUSORA 21 PP', 'EXTRUSORA 22', 'EXTRUSORA 23', 'EXTRUSORA 50', 'EXTRUSORA 51') THEN 'Linea 2'
WHEN machine_name IN ('EXTRUSORA 24', 'EXTRUSORA 25', 'EXTRUSORA 26', 'EXTRUSORA 27', 'EXTRUSORA 53', 'EXTRUSORA 52', 'EXTRUSORA 28', 'EXTRUSORA 29', 'EXTRUSORA 30', 'EXTRUSORA 31 RAYADA', 'EXTRUSORA 55 RAYADA') THEN 'Linea 3'
WHEN machine_name IN ('EXTRUSORA 33', 'EXTRUSORA 45', 'EXTRUSORA 34', 'EXTRUSORA 35', 'EXTRUSORA 36', 'EXTRUSORA 37', 'EXTRUSORA 38', 'EXTRUSORA 39', 'EXTRUSORA 40', 'EXTRUSORA 41', 'EXTRUSORA 42', 'EXTRUSORA 43', 'EXTRUSORA 32 RAYADA', 'EXTRUSORA 44') THEN 'Linea 4'
END`), 'Linea'],
[fn('SUM', fn('CASE', col('production_score_id'), 'FFC4075B6DB64E40', col('primary_quantity_production'), 0)), 'Acumulado'],
[fn('SUM', fn('CASE', col('production_score_id'), '511DFB1B6AD64D8D', col('primary_quantity_production'), 0)), 'Mala']
],
where: {
production_advance_date: {
[Op.between]: ['2025-03-31', '2025-04-04']
},
production_sector_name: 'EXTRUSION',
state: 1,
machine_name: {
[Op.ne]: 'EXTRUSORA PARA REGISTRO 1'
}
},
group: ['turn_type_name', 'Linea']
});

return results;
}

// Call the function to get the data
getProductionData()
.then(data => console.log(data))
.catch(err => console.error(err));*/
