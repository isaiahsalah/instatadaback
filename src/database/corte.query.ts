import { Corte_PA, Corte_PO } from "../models/corte.model";
import { Extrusion_PA, Extrusion_PO, ExtrusionModel } from "../models/extrusion.corte";
import client from "./conexion";

export const corte_pa = async ({
  from,
  to,
}: {
  from: Date;
  to: Date;
}) => {
  try {
    const result = await client.query(`
 SELECT 
        A.turn_type_name AS turno, 
        SUM(A.secondary_quantity_production) AS avance
    FROM 
        production.production_advance A
    WHERE 
        A.production_advance_date  BETWEEN '${
              from.toISOString().split("T")[0]
            }' AND '${to.toISOString().split("T")[0]}' 
        AND A.production_sector_name = 'CORTE' 
        AND A.state = 1
    GROUP BY 
        A.turn_type_name; 


          `);
          
    // Optimización del formato antes de enviarlo en la respuesta JSON
    const optimizedResults:Corte_PA[] = result.rows.map(
      (item:  Corte_PA) => ({
        turno: item.turno, 
        avance: Math.round(Number(item.avance) * 100) / 100, // Redondeamos a 2 decimales
      })
    );
    //console.log(optimizedResults);
    return optimizedResults;
  } catch (error) {
    console.error("❌ Error en consulta production-advance:", error);
  }
};

export const corte_po = async ({
  from,
  to,
}: {
  from: Date;
  to: Date;
}) => {
  try {
    const result = await client.query(`


SELECT 
    O.turn_type_name AS turno, 
    SUM(O.secondary_quantity_production) AS objetivo
FROM 
    production.production_order O
WHERE 
    O.production_order_date BETWEEN '${
          from.toISOString().split("T")[0]
        }' AND '${to.toISOString().split("T")[0]}' 
    AND O.production_sector_name = 'CORTE'
    AND O.state = 1
GROUP BY 
    O.turn_type_name 
ORDER BY 
    O.turn_type_name;


          `);

    // Optimización del formato antes de enviarlo en la respuesta JSON
    const optimizedResults:Corte_PO[] = result.rows.map(
      (item:Corte_PO) => ({
        turno: item.turno, 
        objetivo: Math.round(Number(item.objetivo) * 100) / 100, // Redondeamos a 2 decimales
      })
    );
    //console.log(optimizedResults);
    return optimizedResults;
  } catch (error) {
    console.error("❌ Error en consulta production order:", error);
  }
};
