-- ============================================================
-- HWstore — Seed patch: add PSU formFactor + Case supportedPsuTypes
-- Idempotent: uses slug to locate the rows.
-- ============================================================

-- ── PSUs: add formFactor = 'ATX' (all are standard full-size ATX) ──
UPDATE composants SET specs = specs || '{"formFactor":"ATX"}'::jsonb
WHERE type = 'alimentation';

-- ── Cases: ATX mid/full towers support both ATX and SFX ──
UPDATE composants
  SET specs = specs || '{"supportedPsuTypes":["ATX","SFX"]}'::jsonb
WHERE slug IN (
  'fractal-design-torrent-atx',
  'lian-li-lancool-216',
  'nzxt-h5-flow-compact'
);

-- ── Cooler Master Q300L (Micro-ATX) is compact → supports ATX + SFX + TFX ──
UPDATE composants
  SET specs = specs || '{"supportedPsuTypes":["ATX","SFX","SFX-L","TFX"]}'::jsonb
WHERE slug = 'coolermaster-masterbox-q300l';
