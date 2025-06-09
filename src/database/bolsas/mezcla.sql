--select * from production.production_sector ps where ps.name like 'MEZ%' 

WITH operator_counts AS (
    SELECT 
        production_turn_id,
        COUNT(DISTINCT person_name) AS operator_count
    FROM production.detail_production_turn
	
    WHERE state = 1
    GROUP BY production_turn_id
)

SELECT 
 
    dpt.person_name as operator,  
	--pa.machine_name as machine,
    pa.turn_type_name as turn,  
	SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 1 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS monday,
	SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 2 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS tuesday,
	SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 3 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS wednesday,
	SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 4 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS thursday,
	SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 5 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS friday,
	SUM(pa.primary_quantity_production ) AS total,
	SUM(pa.secondary_quantity_production ) AS weight
  --SUM(CASE pa.production_score_id WHEN '511DFB1B6AD64D8D' THEN pa.primary_quantity_production ELSE 0 END) AS bad

from production.production_advance pa

INNER JOIN 
		operator_counts oc ON oc.production_turn_id = pa.production_turn_id
	INNER JOIN 
		product.product pr ON pr.id = pa.product_id
	INNER JOIN 
		production.production_turn pt ON pt.id = pa.production_turn_id 
	INNER JOIN (
		SELECT DISTINCT production_turn_id, person_id, type, state, person_name 
		FROM production.detail_production_turn
		WHERE state = 1 -- Asegurarte de incluir cualquier filtro adicional necesario
	) dpt ON dpt.production_turn_id = pa.production_turn_id
	 
	LEFT JOIN 
		company.person pe ON pe.id = dpt.person_id
	LEFT JOIN 
		company.team_work tw ON tw.id = pe.team_work_id  
 WHERE 
        pa.production_advance_date BETWEEN $1 AND $2 --fecha de producción
        AND pa.production_sector_id = 'CFF5CF0BC1DC405D' --sector de producción
        AND pa.state = 1 --producción no anulada
group by 
tw.name,
	pa.turn_type_name,
	pa.operator_name,
	dpt.person_name
		
