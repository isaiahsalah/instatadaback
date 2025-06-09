WITH objective_data AS (
    SELECT 
	
        po.turn_type_name AS turn, 
        po.machine_name as machine,
        SUM(po.primary_quantity_production) AS objective
    FROM 
        production.production_order po
    WHERE 
        po.production_order_date  BETWEEN $1 AND $2
        AND po.production_sector_name = 'EXTRUSION' --sector de producción
        AND po.state = 1 --orden no anulada
        AND po.machine_name NOT LIKE 'LAMINADORA 5 PARA REGISTROS' --producción registrada fuera de turno
    GROUP BY 
        po.turn_type_name,
	po.machine_name 
),
production_data AS (
    SELECT 
        pa.turn_type_name AS turn, 
		pa.teamwork_name as group,
        pa.machine_name as machine,
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
    WHERE 
        pa.production_advance_date BETWEEN $1 AND $2 --fecha de producción
        AND pa.production_sector_name = 'EXTRUSION' --sector de producción
        AND pa.state = 1 --producción no anulada
        AND pa.machine_name NOT LIKE 'LAMINADORA 5 PARA REGISTROS' --producción registrada fuera de turno
    GROUP BY
		pa.teamwork_name,
        pa.turn_type_name,
	pa.machine_name
)
SELECT
	pd.group,
    COALESCE(od.turn, pd.turn) AS turn,
	COALESCE(od.machine, pd.machine) AS machine,
    pd.monday,
    pd.tuesday,
    pd.wednesday,
    pd.thursday,
    pd.friday,
    od.objective,
    pd.good,
    pd.bad
FROM
    objective_data od
FULL OUTER JOIN
    production_data pd
ON
    od.turn = pd.turn and
	od.machine = pd.machine
