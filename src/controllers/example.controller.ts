import { Request, Response } from "express";
import sequelize from "../database/conexion";

export const getExample = async (req: Request, res: Response) => {
  try {
    console.log("hola");
    const users = await sequelize.query(
      `
    
WITH production_sums AS (
    SELECT 
        pa.turn_type_name AS Turno, 
        CASE 
            WHEN pa.machine_name IN ('EXTRUSORA 1', 'EXTRUSORA 2', 'EXTRUSORA 3', 'EXTRUSORA 11 RAYADA', 'EXTRUSORA 4', 'EXTRUSORA 5', 'EXTRUSORA 6 RAYADA', 'EXTRUSORA 46', 'EXTRUSORA 7 RAYADA', 'EXTRUSORA 8', 'EXTRUSORA 9', 'EXTRUSORA 47', 'EXTRUSORA 10', 'EXTRUSORA 12', 'EXTRUSORA 54') THEN 'Linea 1'
            WHEN pa.machine_name IN ('EXTRUSORA 13 RAYADA', 'EXTRUSORA 14 RAYADA', 'EXTRUSORA 15', 'EXTRUSORA 16', 'EXTRUSORA 48', 'EXTRUSORA 49', 'EXTRUSORA 17', 'EXTRUSORA 18 RAYADA', 'EXTRUSORA 19 RAYADA', 'EXTRUSORA 20 PP', 'EXTRUSORA 21 PP', 'EXTRUSORA 22', 'EXTRUSORA 23', 'EXTRUSORA 50', 'EXTRUSORA 51') THEN 'Linea 2'
            WHEN pa.machine_name IN ('EXTRUSORA 24', 'EXTRUSORA 25', 'EXTRUSORA 26', 'EXTRUSORA 27', 'EXTRUSORA 53', 'EXTRUSORA 52', 'EXTRUSORA 28', 'EXTRUSORA 29', 'EXTRUSORA 30', 'EXTRUSORA 31 RAYADA', 'EXTRUSORA 55 RAYADA') THEN 'Linea 3'
            WHEN pa.machine_name IN ('EXTRUSORA 33', 'EXTRUSORA 45', 'EXTRUSORA 34', 'EXTRUSORA 35', 'EXTRUSORA 36', 'EXTRUSORA 37', 'EXTRUSORA 38', 'EXTRUSORA 39', 'EXTRUSORA 40', 'EXTRUSORA 41', 'EXTRUSORA 42', 'EXTRUSORA 43', 'EXTRUSORA 32 RAYADA', 'EXTRUSORA 44') THEN 'Linea 4'
        END AS Linea,
        SUM(CASE pa.production_score_id WHEN 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS Acumulado,
        SUM(CASE pa.production_score_id WHEN '511DFB1B6AD64D8D' THEN pa.primary_quantity_production ELSE 0 END) AS Mala
    FROM 
        production.production_advance pa
    WHERE 
        pa.production_advance_date BETWEEN '2025-03-31' AND '2025-04-04' 
        AND pa.production_sector_name = 'EXTRUSION' 
        AND pa.state = 1
        AND pa.machine_name != 'EXTRUSORA PARA REGISTRO 1'
    GROUP BY 
        pa.turn_type_name, 
        Linea
),
objective_sums AS (
    SELECT 
        po.turn_type_name AS Turno, 
        CASE 
            WHEN po.machine_name IN ('EXTRUSORA 1', 'EXTRUSORA 2', 'EXTRUSORA 3', 'EXTRUSORA 11 RAYADA', 'EXTRUSORA 4', 'EXTRUSORA 5', 'EXTRUSORA 6 RAYADA', 'EXTRUSORA 46', 'EXTRUSORA 7 RAYADA', 'EXTRUSORA 8', 'EXTRUSORA 9', 'EXTRUSORA 47', 'EXTRUSORA 10', 'EXTRUSORA 12', 'EXTRUSORA 54') THEN 'Linea 1'
            WHEN po.machine_name IN ('EXTRUSORA 13 RAYADA', 'EXTRUSORA 14 RAYADA', 'EXTRUSORA 15', 'EXTRUSORA 16', 'EXTRUSORA 48', 'EXTRUSORA 49', 'EXTRUSORA 17', 'EXTRUSORA 18 RAYADA', 'EXTRUSORA 19 RAYADA', 'EXTRUSORA 20 PP', 'EXTRUSORA 21 PP', 'EXTRUSORA 22', 'EXTRUSORA 23', 'EXTRUSORA 50', 'EXTRUSORA 51') THEN 'Linea 2'
            WHEN po.machine_name IN ('EXTRUSORA 24', 'EXTRUSORA 25', 'EXTRUSORA 26', 'EXTRUSORA 27', 'EXTRUSORA 53', 'EXTRUSORA 52', 'EXTRUSORA 28', 'EXTRUSORA 29', 'EXTRUSORA 30', 'EXTRUSORA 31 RAYADA', 'EXTRUSORA 55 RAYADA') THEN 'Linea 3'
            WHEN po.machine_name IN ('EXTRUSORA 33', 'EXTRUSORA 45', 'EXTRUSORA 34', 'EXTRUSORA 35', 'EXTRUSORA 36', 'EXTRUSORA 37', 'EXTRUSORA 38', 'EXTRUSORA 39', 'EXTRUSORA 40', 'EXTRUSORA 41', 'EXTRUSORA 42', 'EXTRUSORA 43', 'EXTRUSORA 32 RAYADA', 'EXTRUSORA 44') THEN 'Linea 4'
        END AS Linea,
        SUM(po.primary_quantity_production) AS Objetivo
    FROM 
        production.production_order po
    WHERE 
        po.production_order_date BETWEEN '2025-03-31' AND '2025-04-04'
        AND po.production_sector_name = 'EXTRUSION' 
        AND po.state = 1
        AND po.machine_name != 'EXTRUSORA PARA REGISTRO 1'
    GROUP BY 
        po.turn_type_name, 
        Linea
),
all_turns_lines AS (
    SELECT 
        turn.turn_type_name AS Turno,
        line.Linea
    FROM 
        (VALUES ('Dia'), ('Noche')) AS turn(turn_type_name),
        (VALUES ('Linea 1'), ('Linea 2'), ('Linea 3'), ('Linea 4')) AS line(Linea)
)
        
SELECT 
    ATL.Turno, 
    ATL.Linea,
    COALESCE(CAST(PS.Acumulado AS INTEGER), 0) AS Acumulado,
    COALESCE(CAST(OS.Objetivo AS INTEGER), 0) AS Objetivo,
    COALESCE(CAST(PS.Mala AS INTEGER), 0) AS Mala,
    -- Cálculo de 'Cumplimiento' como porcentaje
    CASE 
        WHEN OS.Objetivo > 0 
        THEN ROUND((CAST(PS.Acumulado AS NUMERIC) / OS.Objetivo) * 100, 2)
        ELSE 0
    END AS Cumplimiento,
    -- Cálculo de 'Calidad' como porcentaje
    CASE 
        WHEN (PS.Acumulado + PS.Mala) > 0 
        THEN ROUND((CAST(PS.Acumulado AS NUMERIC) / (PS.Acumulado + PS.Mala)) * 100, 2)
        ELSE 0
    END AS Calidad,
    -- Cálculo de 'Promedio' como el promedio de 'Cumplimiento' y 'Calidad'
    ROUND(
        (
            CASE 
                WHEN OS.Objetivo > 0 
                THEN (CAST(PS.Acumulado AS NUMERIC) / OS.Objetivo) * 100
                ELSE 0
            END
            +
            CASE 
                WHEN (PS.Acumulado + PS.Mala) > 0 
                THEN (CAST(PS.Acumulado AS NUMERIC) / (PS.Acumulado + PS.Mala) * 100)
                ELSE 0
            END
        ) / 2, 2
    ) AS Promedio
FROM 
    all_turns_lines ATL
LEFT JOIN 
    production_sums PS
ON 
    ATL.Turno = PS.Turno
    AND ATL.Linea = PS.Linea
LEFT JOIN 
    objective_sums OS 
ON 
    ATL.Turno = OS.Turno
    AND ATL.Linea = OS.Linea
ORDER BY 
    ATL.Turno, 
    ATL.Linea;
        `,
      {
        type: "SELECT", // Tipo de consulta (SELECT, INSERT, UPDATE, etc.)
      }
    );

    res.json(users);
  } catch (error) {
    console.error("❌ Error en consulta bruta:", error);
    res.status(500).json({ error: "Error al obtener los datos" });
  }
};
