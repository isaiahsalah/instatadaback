

    SELECT 
        pa.turn_type_name AS turn, 
       
        SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 1 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS monday,
        SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 2 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS tuesday,
        SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 3 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS wednesday,
        SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 4 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS thursday,
        SUM(CASE WHEN EXTRACT(DOW FROM pa.production_advance_date) = 5 AND pa.production_score_id = 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS friday,
        SUM(CASE pa.production_score_id WHEN 'FFC4075B6DB64E40' THEN pa.primary_quantity_production ELSE 0 END) AS bulk,
        SUM(CASE pa.production_score_id WHEN 'FFC4075B6DB64E40' THEN pa.secondary_quantity_production ELSE 0 END) AS weight

    FROM 
        production.production_advance pa
    LEFT JOIN 
        production.production_turn pt  ON  pt.id = pa.production_turn_id 
    WHERE 
        pa.production_advance_date BETWEEN   $1 AND $2  --fecha de producción
        AND pa.production_sector_id = '725724FA075E4984' --sector de producción
        AND pa.state = 1 --producción no anulada
        AND pa.machine_name NOT LIKE '%EXTRUSORA PARA REGISTRO%' --producción registrada fuera de turno
		AND pa.machine_name NOT LIKE '%REFILADORA%' --producción registrada fuera de turno
    GROUP BY  
        pa.turn_type_name

