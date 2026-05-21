-- ============================================================
-- HWstore — Builder Engine: PostgreSQL Index Migration
-- Run once against the hwstore database.
-- ============================================================

-- 1. GIN index for full JSONB queries on specs (catch-all)
CREATE INDEX IF NOT EXISTS idx_composants_specs_gin
  ON composants USING GIN (specs);

-- 2. Targeted B-tree: socket lookup (CPU + Motherboard pre-filtering)
CREATE INDEX IF NOT EXISTS idx_composants_specs_socket
  ON composants ((specs->>'socket'))
  WHERE type IN ('processeur', 'carte-mere');

-- 3. Targeted B-tree: RAM type lookup
CREATE INDEX IF NOT EXISTS idx_composants_specs_ram_type
  ON composants ((specs->>'type'))
  WHERE type = 'ram';

-- 4. Targeted B-tree: form factor (motherboard + case)
CREATE INDEX IF NOT EXISTS idx_composants_specs_form_factor
  ON composants ((specs->>'formFactor'))
  WHERE type IN ('carte-mere', 'boitier');

-- 5. Composite index: type + stock (most common filter combo)
CREATE INDEX IF NOT EXISTS idx_composants_type_stock
  ON composants (type, stock)
  WHERE stock > 0;

-- 6. Rating index for default sort
CREATE INDEX IF NOT EXISTS idx_composants_rating
  ON composants (rating DESC);

-- 7. PSU wattage (cast to int for range queries)
CREATE INDEX IF NOT EXISTS idx_composants_psu_wattage
  ON composants (((specs->>'wattage')::int))
  WHERE type = 'alimentation';

-- 8. GPU length (cast to int for range queries)
CREATE INDEX IF NOT EXISTS idx_composants_gpu_length
  ON composants (((specs->>'lengthMm')::int))
  WHERE type = 'gpu';

-- ============================================================
-- Optional: Materialized view for CPU ↔ Motherboard pairs
-- Useful for catalogs > 5000 SKUs.
-- Refresh nightly or on stock/spec update.
-- ============================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS compatible_cpu_motherboard AS
SELECT
  cpu.id                   AS cpu_id,
  cpu.name                 AS cpu_name,
  cpu.price                AS cpu_price,
  mb.id                    AS motherboard_id,
  mb.name                  AS motherboard_name,
  cpu.specs->>'socket'     AS socket
FROM composants cpu
JOIN composants mb
  ON cpu.specs->>'socket' = mb.specs->>'socket'
WHERE cpu.type = 'processeur'
  AND mb.type  = 'carte-mere'
  AND cpu.stock > 0
  AND mb.stock  > 0;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ccm_unique
  ON compatible_cpu_motherboard (cpu_id, motherboard_id);

CREATE INDEX IF NOT EXISTS idx_ccm_by_motherboard
  ON compatible_cpu_motherboard (motherboard_id);

CREATE INDEX IF NOT EXISTS idx_ccm_by_cpu
  ON compatible_cpu_motherboard (cpu_id);

-- Refresh command (run via cron or after catalog updates):
-- REFRESH MATERIALIZED VIEW CONCURRENTLY compatible_cpu_motherboard;
