--PRODUCTO ANTERIOR
select
 	pa_last.production_advance_date as date,
	pa_last.production_sector_name as sector,
 	pa_last.turn_type_name as turn,
    --pe.full_name as operador,
	CASE
		WHEN pa_last.production_sector_name IN ('CORTE', 'IMPRESION', 'EMPAQUE') THEN
			(SELECT string_agg(distinct dpt_op.person_name, '||'::text)
			FROM production.detail_production_turn dpt_op
			WHERE dpt_op.production_turn_id = pa_last.production_turn_id
			and dpt_op.state = 1 )
		ELSE
			pe.full_name
	END as operador,
	CASE
		WHEN pa_last.production_sector_name IN ('CORTE', 'IMPRESION', 'EMPAQUE') THEN
			(SELECT string_agg(distinct dpt_tw.name, '||'::text)
			FROM production.detail_production_turn dpt_group
			JOIN company.person dpt_pe on dpt_pe.id = dpt_group.person_created_id
			JOIN company.team_work dpt_tw ON dpt_tw.id = dpt_pe.team_work_id 
			WHERE dpt_group.production_turn_id = pa_last.production_turn_id
			and dpt_group.state = 1 )
		ELSE
			tw.name
	END as "group",
 	pa_last.product_name as product,
	pa_last.primary_unit_measure_production_name as primary_unit,
	pa_last.primary_quantity_production as primary_quantity,
	pa_last.secondary_unit_measure_production_name as secondary_unit,
	pa_last.secondary_quantity_production as secondary_quantity,
	--inv.lot as lote_corte,
	--pa_next.product_name as producto_siguiente,
 	pa_last.production_advance_batch as lote
from cost.raw_material_cost  rmc
 	inner join production.production_advance pa_next on pa_next.id = rmc.production_advance_id 
  	--inner join product.product pr on pr.id = rmc.product_id
  	inner join warehouse.inventory inv on inv.id = rmc.inventory_id
 	inner join production.production_advance pa_last on pa_last.production_advance_batch = inv.lot
	LEFT JOIN company.person pe on pe.id = pa_last.person_created_id
	LEFT JOIN company.team_work tw ON tw.id = pe.team_work_id 

 where 
	pa_next.production_advance_batch = '2504254817E1D5-1'
    AND pa_next.state = 1   
	
ORDER BY
 	pa_last.production_advance_date,
	pa_last.turn_type_name,
	lote
 
 