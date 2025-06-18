
 --PRODUCTO SIGUIENTE
 
 select
 	pa_next.production_advance_date as date,
	pa_next.production_sector_name as sector,
 	pa_next.turn_type_name as turn,
	CASE
		WHEN pa_next.production_sector_name IN ('CORTE', 'IMPRESION', 'EMPAQUE') THEN
			(SELECT string_agg(distinct dpt.person_name, '||'::text) AS operator_name
			FROM production.detail_production_turn dpt
			WHERE dpt.production_turn_id = pa_next.production_turn_id
			and dpt.state = 1 )
		ELSE
			pe.full_name
	END as operador,
	CASE
		WHEN pa_next.production_sector_name IN ('CORTE', 'IMPRESION', 'EMPAQUE') THEN
			(SELECT string_agg(distinct dpt_tw.name, '||'::text)
			FROM production.detail_production_turn dpt_group
			JOIN company.person dpt_pe on dpt_pe.id = dpt_group.person_created_id
			JOIN company.team_work dpt_tw ON dpt_tw.id = dpt_pe.team_work_id 
			WHERE dpt_group.production_turn_id = pa_next.production_turn_id
			and dpt_group.state = 1 )
		ELSE
			tw.name
	END as "group",
	pa_next.product_name as product,
	pa_next.primary_unit_measure_production_name as primary_unit,
	pa_next.primary_quantity_production as primary_quantity,
	pa_next.secondary_unit_measure_production_name as secondary_unit,
	pa_next.secondary_quantity_production as secondary_quantity,
 	pa_next.production_advance_batch as lote
from cost.raw_material_cost  rmc
 	inner join production.production_advance pa_next on pa_next.id = rmc.production_advance_id 
  	--inner join product.product pr on pr.id = rmc.product_id
  	inner join warehouse.inventory inv on inv.id = rmc.inventory_id
 	inner join production.production_advance pa_last on pa_last.production_advance_batch = inv.lot
	LEFT JOIN company.person pe on   pe.id = pa_next.person_created_id
	LEFT JOIN company.team_work tw ON tw.id = pe.team_work_id 

 where 
 	--pa.production_sector_name = 'EMBULTAJE' 
        --AND pab.production_sector_name IN ('CORTE', 'EMPAQUE')
	pa_last.production_advance_batch = '2504254817E1D5-1'
    AND pa_last.state = 1   
	
ORDER BY 
 	pa_next.production_advance_date,
	pa_next.turn_type_name,
	lote
 
