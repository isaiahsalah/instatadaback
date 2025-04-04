import client from "./conexion";

export const productionAdvance =async ({from, to}:{from: Date, to:Date})=>{
    try {
        const result = await client.query(`
          SELECT 
            pa.turn_type_name AS Turno, 
            CASE 
                WHEN pa.machine_name IN ('EXTRUSORA 1', 'EXTRUSORA 2', 'EXTRUSORA 3', 'EXTRUSORA 11 RAYADA', 'EXTRUSORA 4', 'EXTRUSORA 5', 'EXTRUSORA 6 RAYADA', 'EXTRUSORA 46', 'EXTRUSORA 7 RAYADA', 'EXTRUSORA 8', 'EXTRUSORA 9', 'EXTRUSORA 47', 'EXTRUSORA 10', 'EXTRUSORA 12', 'EXTRUSORA 54') THEN '1'
                WHEN pa.machine_name IN ('EXTRUSORA 13 RAYADA', 'EXTRUSORA 14 RAYADA', 'EXTRUSORA 15', 'EXTRUSORA 16', 'EXTRUSORA 48', 'EXTRUSORA 49', 'EXTRUSORA 17', 'EXTRUSORA 18 RAYADA', 'EXTRUSORA 19 RAYADA', 'EXTRUSORA 20 PP', 'EXTRUSORA 21 PP', 'EXTRUSORA 22', 'EXTRUSORA 23', 'EXTRUSORA 50', 'EXTRUSORA 51') THEN '2'
                WHEN pa.machine_name IN ('EXTRUSORA 24', 'EXTRUSORA 25', 'EXTRUSORA 26', 'EXTRUSORA 27', 'EXTRUSORA 53', 'EXTRUSORA 52', 'EXTRUSORA 28', 'EXTRUSORA 29', 'EXTRUSORA 30', 'EXTRUSORA 31 RAYADA', 'EXTRUSORA 55 RAYADA') THEN '3'
                WHEN pa.machine_name IN ('EXTRUSORA 33', 'EXTRUSORA 45', 'EXTRUSORA 34', 'EXTRUSORA 35', 'EXTRUSORA 36', 'EXTRUSORA 37', 'EXTRUSORA 38', 'EXTRUSORA 39', 'EXTRUSORA 40', 'EXTRUSORA 41', 'EXTRUSORA 42', 'EXTRUSORA 43', 'EXTRUSORA 32 RAYADA', 'EXTRUSORA 44') THEN '4'
            END AS Linea,
            SUM(CASE pa.production_score_id WHEN 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS Acumulado,
            SUM(CASE pa.production_score_id WHEN '511DFB1B6AD64D8D' THEN pa.primary_quantity_production ELSE 0 END) AS Mala
        FROM 
            production.production_advance pa
        WHERE 
            pa.production_advance_date BETWEEN '${from.toISOString().split('T')[0]}' AND '${to.toISOString().split('T')[0]}' 
            AND pa.production_sector_name = 'EXTRUSION' 
            AND pa.state = 1
            AND pa.machine_name != 'EXTRUSORA PARA REGISTRO 1'
        GROUP BY 
            pa.turn_type_name, 
            Linea
          `);
        // Optimización del formato antes de enviarlo en la respuesta JSON
        const optimizedResults = result.rows.map(
          (item: { turno: any; linea: any; acumulado: string; mala: string }) => ({
            turno: item.turno,
            linea: item.linea,
            acumulado: parseFloat(item.acumulado).toFixed(2), // Redondeamos a 2 decimales
            mala: parseFloat(item.mala).toFixed(2), // Redondeamos a 2 decimales
          })
        );
        console.log(optimizedResults);
        return optimizedResults
      } catch (error) {
        console.error("❌ Error en consulta production-advance:", error);
      }
}


export const productionOrder =async ({from, to}:{from: Date, to:Date})=>{
    try {
        const result = await client.query(`
         SELECT 
        po.turn_type_name AS Turno, 
        CASE 
            WHEN po.machine_name IN ('EXTRUSORA 1', 'EXTRUSORA 2', 'EXTRUSORA 3', 'EXTRUSORA 11 RAYADA', 'EXTRUSORA 4', 'EXTRUSORA 5', 'EXTRUSORA 6 RAYADA', 'EXTRUSORA 46', 'EXTRUSORA 7 RAYADA', 'EXTRUSORA 8', 'EXTRUSORA 9', 'EXTRUSORA 47', 'EXTRUSORA 10', 'EXTRUSORA 12', 'EXTRUSORA 54') THEN '1'
            WHEN po.machine_name IN ('EXTRUSORA 13 RAYADA', 'EXTRUSORA 14 RAYADA', 'EXTRUSORA 15', 'EXTRUSORA 16', 'EXTRUSORA 48', 'EXTRUSORA 49', 'EXTRUSORA 17', 'EXTRUSORA 18 RAYADA', 'EXTRUSORA 19 RAYADA', 'EXTRUSORA 20 PP', 'EXTRUSORA 21 PP', 'EXTRUSORA 22', 'EXTRUSORA 23', 'EXTRUSORA 50', 'EXTRUSORA 51') THEN '2'
            WHEN po.machine_name IN ('EXTRUSORA 24', 'EXTRUSORA 25', 'EXTRUSORA 26', 'EXTRUSORA 27', 'EXTRUSORA 53', 'EXTRUSORA 52', 'EXTRUSORA 28', 'EXTRUSORA 29', 'EXTRUSORA 30', 'EXTRUSORA 31 RAYADA', 'EXTRUSORA 55 RAYADA') THEN '3'
            WHEN po.machine_name IN ('EXTRUSORA 33', 'EXTRUSORA 45', 'EXTRUSORA 34', 'EXTRUSORA 35', 'EXTRUSORA 36', 'EXTRUSORA 37', 'EXTRUSORA 38', 'EXTRUSORA 39', 'EXTRUSORA 40', 'EXTRUSORA 41', 'EXTRUSORA 42', 'EXTRUSORA 43', 'EXTRUSORA 32 RAYADA', 'EXTRUSORA 44') THEN '4'
        END AS Linea,
        SUM(po.primary_quantity_production) AS Objetivo
    FROM 
        production.production_order po
    WHERE 
        po.production_order_date BETWEEN '${from.toISOString().split('T')[0]}' AND '${to.toISOString().split('T')[0]}' 
        AND po.production_sector_name = 'EXTRUSION' 
        AND po.state = 1
        AND po.machine_name != 'EXTRUSORA PARA REGISTRO 1'
    GROUP BY 
        po.turn_type_name, 
        Linea
          `);
    
        console.log(result.rows);
        return result.rows
      } catch (error) {
        console.error("❌ Error en consulta production order:", error);
      }
}


