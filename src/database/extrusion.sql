
	
WITH objective_data AS (
    SELECT 
        po.turn_type_name AS turn, 
        CASE 
            WHEN po.machine_name IN ('EXTRUSORA 1', 'EXTRUSORA 2', 'EXTRUSORA 3', 'EXTRUSORA 11 RAYADA', 'EXTRUSORA 4', 'EXTRUSORA 5', 'EXTRUSORA 6 RAYADA', 'EXTRUSORA 46', 'EXTRUSORA 7 RAYADA', 'EXTRUSORA 8', 'EXTRUSORA 9', 'EXTRUSORA 47', 'EXTRUSORA 10', 'EXTRUSORA 12', 'EXTRUSORA 54') THEN '1'
            WHEN po.machine_name IN ('EXTRUSORA 13 RAYADA', 'EXTRUSORA 14 RAYADA', 'EXTRUSORA 15', 'EXTRUSORA 16', 'EXTRUSORA 48', 'EXTRUSORA 49', 'EXTRUSORA 17', 'EXTRUSORA 18 RAYADA', 'EXTRUSORA 19 RAYADA', 'EXTRUSORA 20 PP', 'EXTRUSORA 21 PP', 'EXTRUSORA 22', 'EXTRUSORA 23', 'EXTRUSORA 50', 'EXTRUSORA 51') THEN '2'
            WHEN po.machine_name IN ('EXTRUSORA 24', 'EXTRUSORA 25', 'EXTRUSORA 26', 'EXTRUSORA 27', 'EXTRUSORA 53', 'EXTRUSORA 52', 'EXTRUSORA 28', 'EXTRUSORA 29', 'EXTRUSORA 30', 'EXTRUSORA 31 RAYADA', 'EXTRUSORA 55 RAYADA') THEN '3'
            WHEN po.machine_name IN ('EXTRUSORA 33', 'EXTRUSORA 45', 'EXTRUSORA 34', 'EXTRUSORA 35', 'EXTRUSORA 36', 'EXTRUSORA 37', 'EXTRUSORA 38', 'EXTRUSORA 39', 'EXTRUSORA 40', 'EXTRUSORA 41', 'EXTRUSORA 42', 'EXTRUSORA 43', 'EXTRUSORA 32 RAYADA', 'EXTRUSORA 44') THEN '4'
        END AS line,
        SUM(po.primary_quantity_production) AS objective
    FROM 
        production.production_order po
    WHERE 
        po.production_order_date  BETWEEN $1 AND $2
        AND po.production_sector_name = 'EXTRUSION' --sector de producción
        AND po.state = 1 --orden no anulada
        AND po.machine_name != 'EXTRUSORA PARA REGISTRO 1' 
    GROUP BY 
        po.turn_type_name, 
        line
),
production_data AS (
    SELECT 
        pa.turn_type_name AS turn, 
		tw.code as group,
        CASE 
            WHEN pa.machine_name IN ('EXTRUSORA 1', 'EXTRUSORA 2', 'EXTRUSORA 3', 'EXTRUSORA 11 RAYADA', 'EXTRUSORA 4', 'EXTRUSORA 5', 'EXTRUSORA 6 RAYADA', 'EXTRUSORA 46', 'EXTRUSORA 7 RAYADA', 'EXTRUSORA 8', 'EXTRUSORA 9', 'EXTRUSORA 47', 'EXTRUSORA 10', 'EXTRUSORA 12', 'EXTRUSORA 54') THEN '1'
            WHEN pa.machine_name IN ('EXTRUSORA 13 RAYADA', 'EXTRUSORA 14 RAYADA', 'EXTRUSORA 15', 'EXTRUSORA 16', 'EXTRUSORA 48', 'EXTRUSORA 49', 'EXTRUSORA 17', 'EXTRUSORA 18 RAYADA', 'EXTRUSORA 19 RAYADA', 'EXTRUSORA 20 PP', 'EXTRUSORA 21 PP', 'EXTRUSORA 22', 'EXTRUSORA 23', 'EXTRUSORA 50', 'EXTRUSORA 51') THEN '2'
            WHEN pa.machine_name IN ('EXTRUSORA 24', 'EXTRUSORA 25', 'EXTRUSORA 26', 'EXTRUSORA 27', 'EXTRUSORA 53', 'EXTRUSORA 52', 'EXTRUSORA 28', 'EXTRUSORA 29', 'EXTRUSORA 30', 'EXTRUSORA 31 RAYADA', 'EXTRUSORA 55 RAYADA') THEN '3'
            WHEN pa.machine_name IN ('EXTRUSORA 33', 'EXTRUSORA 45', 'EXTRUSORA 34', 'EXTRUSORA 35', 'EXTRUSORA 36', 'EXTRUSORA 37', 'EXTRUSORA 38', 'EXTRUSORA 39', 'EXTRUSORA 40', 'EXTRUSORA 41', 'EXTRUSORA 42', 'EXTRUSORA 43', 'EXTRUSORA 32 RAYADA', 'EXTRUSORA 44') THEN '4'
        END AS line,
        SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 1 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS monday,
        SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 2 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS tuesday,
        SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 3 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS wednesday,
        SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 4 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS thursday,
        SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 5 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS friday,
        SUM(CASE pa.production_score_id WHEN 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS good,
        SUM(CASE pa.production_score_id WHEN '511DFB1B6AD64D8D' THEN pa.primary_quantity_production ELSE 0 END) AS bad
    FROM 
        production.production_advance pa
    LEFT JOIN 
        production.production_turn pt  ON  pt.id = pa.production_turn_id
    LEFT JOIN 
        company.person pe  ON  pe.id = pt.operator_id
    LEFT JOIN 
        company.team_work tw  ON  tw.id = pe.team_work_id
    WHERE 
        pa.production_advance_date BETWEEN $1 AND $2 
        AND pa.production_sector_name = 'EXTRUSION' --sector de producción
        AND pa.state = 1 --producción no anulada
        AND pa.machine_name != 'EXTRUSORA PARA REGISTRO 1' --producción registrada fuera de turno
    GROUP BY  
		tw.code,
        pa.turn_type_name, 
        line
)
SELECT 
	pd.group,
    COALESCE(od.turn, pd.turn) AS turn,
    COALESCE(od.line, pd.line) AS line,
    od.objective,
    pd.monday,
    pd.tuesday,
    pd.wednesday,
    pd.thursday,
    pd.friday,
    pd.good,
    pd.bad
FROM 
    objective_data od
FULL OUTER JOIN 
    production_data pd
ON 
    od.turn = pd.turn AND od.line = pd.line;
