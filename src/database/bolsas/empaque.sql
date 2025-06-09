WITH operator_counts AS (
    SELECT 
        production_turn_id,
        COUNT(DISTINCT person_name) AS operator_count
    FROM production.detail_production_turn
    WHERE state = 1
    GROUP BY production_turn_id
)
SELECT 
    tw.name AS group,
    dpt.person_name as operator, 
     pa.turn_type_name as turn,  
	 
	ROUND(SUM(
    CASE 
        WHEN EXTRACT(DOW FROM pa.production_advance_date) = 1 THEN 
            CASE 
                
                         WHEN pa.primary_unit_measure_production_id = 'E0DBACA97DFC47FB' THEN 
                            pa.primary_quantity_production
                        WHEN co.unit_measure_id = pa.primary_unit_measure_production_id THEN 
                            pa.primary_quantity_production * CAST(co.quantity_equivalent AS DECIMAL) / CAST(co.quantity AS DECIMAL)
                        WHEN co.equivalent_unit_measure_id = pa.primary_unit_measure_production_id THEN 
                            pa.primary_quantity_production * CAST(co.quantity AS DECIMAL) / CAST(co.quantity_equivalent AS DECIMAL)
                        ELSE 
                            0
              END * 
            CASE 
                WHEN oc.operator_count > 1 THEN 0.6
                ELSE 1
            END
        ELSE 0
    END
), 2) AS monday,
ROUND(SUM(
    CASE 
        WHEN EXTRACT(DOW FROM pa.production_advance_date) = 2 THEN 
            CASE 
                         WHEN pa.primary_unit_measure_production_id = 'E0DBACA97DFC47FB' THEN 
                            pa.primary_quantity_production
                        WHEN co.unit_measure_id = pa.primary_unit_measure_production_id THEN 
                            pa.primary_quantity_production * CAST(co.quantity_equivalent AS DECIMAL) / CAST(co.quantity AS DECIMAL)
                        WHEN co.equivalent_unit_measure_id = pa.primary_unit_measure_production_id THEN 
                            pa.primary_quantity_production * CAST(co.quantity AS DECIMAL) / CAST(co.quantity_equivalent AS DECIMAL)
                        ELSE 
                            0
              END * 
            CASE 
                WHEN oc.operator_count > 1 THEN 0.6
                ELSE 1
            END
        ELSE 0
    END
), 2) AS tuesday,
ROUND(SUM(
    CASE 
        WHEN EXTRACT(DOW FROM pa.production_advance_date) = 3 THEN 
            CASE 
                         WHEN pa.primary_unit_measure_production_id = 'E0DBACA97DFC47FB' THEN 
                            pa.primary_quantity_production
                        WHEN co.unit_measure_id = pa.primary_unit_measure_production_id THEN 
                            pa.primary_quantity_production * CAST(co.quantity_equivalent AS DECIMAL) / CAST(co.quantity AS DECIMAL)
                        WHEN co.equivalent_unit_measure_id = pa.primary_unit_measure_production_id THEN 
                            pa.primary_quantity_production * CAST(co.quantity AS DECIMAL) / CAST(co.quantity_equivalent AS DECIMAL)
                        ELSE 
                            0
              END * 
            CASE 
                WHEN oc.operator_count > 1 THEN 0.6
                ELSE 1
            END
        ELSE 0
    END
), 2) AS wednesday,
ROUND(SUM(
    CASE 
        WHEN EXTRACT(DOW FROM pa.production_advance_date) = 4 THEN 
            CASE 
                         WHEN pa.primary_unit_measure_production_id = 'E0DBACA97DFC47FB' THEN 
                            pa.primary_quantity_production
                        WHEN co.unit_measure_id = pa.primary_unit_measure_production_id THEN 
                            pa.primary_quantity_production * CAST(co.quantity_equivalent AS DECIMAL) / CAST(co.quantity AS DECIMAL)
                        WHEN co.equivalent_unit_measure_id = pa.primary_unit_measure_production_id THEN 
                            pa.primary_quantity_production * CAST(co.quantity AS DECIMAL) / CAST(co.quantity_equivalent AS DECIMAL)
                        ELSE 
                            0
              END * 
            CASE 
                WHEN oc.operator_count > 1 THEN 0.6
                ELSE 1
            END
        ELSE 0
    END
), 2) AS thursday,
ROUND(SUM(
    CASE 
        WHEN EXTRACT(DOW FROM pa.production_advance_date) = 5 THEN 
            CASE 
                         WHEN pa.primary_unit_measure_production_id = 'E0DBACA97DFC47FB' THEN 
                            pa.primary_quantity_production
                        WHEN co.unit_measure_id = pa.primary_unit_measure_production_id THEN 
                            pa.primary_quantity_production * CAST(co.quantity_equivalent AS DECIMAL) / CAST(co.quantity AS DECIMAL)
                        WHEN co.equivalent_unit_measure_id = pa.primary_unit_measure_production_id THEN 
                            pa.primary_quantity_production * CAST(co.quantity AS DECIMAL) / CAST(co.quantity_equivalent AS DECIMAL)
                        ELSE 
                            0
              END * 
            CASE 
                WHEN oc.operator_count > 1 THEN 0.6
                ELSE 1
            END
        ELSE 0
    END
), 2) AS friday,

	ROUND(
		SUM(
			pa.secondary_quantity_production * 
			CASE 
				WHEN oc.operator_count > 1 THEN 0.6
				ELSE 1
			END
		), 2
	)AS weight,
    ROUND(
        SUM(
            CASE 
                WHEN pa.primary_unit_measure_production_id = 'E0DBACA97DFC47FB' THEN 
                    pa.primary_quantity_production
                WHEN co.unit_measure_id = pa.primary_unit_measure_production_id THEN 
                    pa.primary_quantity_production * CAST(co.quantity_equivalent AS DECIMAL) / CAST(co.quantity AS DECIMAL)
                WHEN co.equivalent_unit_measure_id = pa.primary_unit_measure_production_id THEN 
                    pa.primary_quantity_production * CAST(co.quantity AS DECIMAL) / CAST(co.quantity_equivalent AS DECIMAL)
                ELSE 
                    0
            END * 
            CASE 
                WHEN oc.operator_count > 1 THEN 0.6
                ELSE 1
            END
        ), 2
    ) AS jaba
FROM production.production_advance pa
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
	LEFT JOIN  product.conversion co 
		ON co.product_id = pr.id 
		AND pa.primary_unit_measure_production_id != 'E0DBACA97DFC47FB'
		AND (
			(co.unit_measure_id = pa.primary_unit_measure_production_id 
				AND co.equivalent_unit_measure_id = 'E0DBACA97DFC47FB')
			OR 
			(co.equivalent_unit_measure_id = pa.primary_unit_measure_production_id 
				AND co.unit_measure_id = 'E0DBACA97DFC47FB')
		)
		AND (
		co.unit_measure_id < co.equivalent_unit_measure_id
		OR NOT EXISTS (
			SELECT 1
			FROM product.conversion co2
			WHERE co2.product_id = co.product_id
			AND co2.unit_measure_id = co.equivalent_unit_measure_id
			AND co2.equivalent_unit_measure_id = co.unit_measure_id
		)
	)
	LEFT JOIN 
		company.person pe ON pe.id = dpt.person_id
	LEFT JOIN 
		company.team_work tw ON tw.id = pe.team_work_id  
WHERE 
    pa.production_sector_id = '989FCCEA0DD44E4E' --sector de producción
    AND pa.production_advance_date  BETWEEN $1 AND $2 --fecha de producción
	--AND pa.machine_name != 'CORTADORA PARA REGISTROS' --producción registrada fuera de turno
    AND pa.state = 1 --producción no anulada 
GROUP BY 
	tw.name,
	pa.turn_type_name,
	dpt.person_name 
ORDER BY 
    tw.name ASC,  
	dpt.person_name
 