-- ============================================================
-- HWstore — Real Component Seed Data (Builder Engine Test)
-- Based on actual market components (2024/2025)
-- Run: psql -U postgres -d hwstore -f seed-components.sql
-- ============================================================

-- NOTE: subcategoryId = NULL or set to a valid subcategory ID if needed.
-- All prices in EUR (adjust to your local currency).

-- ============================================================
-- MOTHERBOARDS (carte-mere)
-- ============================================================
INSERT INTO composants (name, slug, brand, price, rating, images, type, description, specs, tags, stock)
VALUES
(
  'ASUS ROG STRIX B650E-F Gaming WiFi',
  'asus-rog-strix-b650e-f-wifi',
  'ASUS', 289.99, 4.7,
  ARRAY['https://m.media-amazon.com/images/I/81nCiMOuQmL._AC_SL1500_.jpg'],
  'carte-mere',
  'Carte mère AM5 DDR5 ATX avec WiFi 6E et PCIe 5.0',
  '{"socket":"AM5","chipset":"B650E","ramType":"DDR5","maxRam":128,"pcieVersion":5,"formFactor":"ATX","ramSlots":4}'::jsonb,
  '{}', 15
),
(
  'MSI MAG X670E TOMAHAWK WiFi',
  'msi-mag-x670e-tomahawk-wifi',
  'MSI', 349.99, 4.6,
  ARRAY['https://m.media-amazon.com/images/I/81-VFcpXC7L._AC_SL1500_.jpg'],
  'carte-mere',
  'Carte mère haut de gamme AM5 X670E DDR5 ATX',
  '{"socket":"AM5","chipset":"X670E","ramType":"DDR5","maxRam":192,"pcieVersion":5,"formFactor":"ATX","ramSlots":4}'::jsonb,
  '{}', 10
),
(
  'Gigabyte B650 AORUS Elite AX',
  'gigabyte-b650-aorus-elite-ax',
  'Gigabyte', 219.99, 4.5,
  ARRAY['https://m.media-amazon.com/images/I/81wl7BQqe7L._AC_SL1500_.jpg'],
  'carte-mere',
  'Carte mère AM5 B650 DDR5 ATX WiFi 6E',
  '{"socket":"AM5","chipset":"B650","ramType":"DDR5","maxRam":128,"pcieVersion":5,"formFactor":"ATX","ramSlots":4}'::jsonb,
  '{}', 20
),
(
  'MSI PRO B760M-A WiFi DDR4',
  'msi-pro-b760m-a-wifi-ddr4',
  'MSI', 139.99, 4.4,
  ARRAY['https://m.media-amazon.com/images/I/71vHHXlREJL._AC_SL1500_.jpg'],
  'carte-mere',
  'Carte mère Intel LGA1700 B760 Micro-ATX DDR4',
  '{"socket":"LGA1700","chipset":"B760","ramType":"DDR4","maxRam":128,"pcieVersion":4,"formFactor":"Micro-ATX","ramSlots":2}'::jsonb,
  '{}', 18
);

-- ============================================================
-- CPUs (processeur)
-- ============================================================
INSERT INTO composants (name, slug, brand, price, rating, images, type, description, specs, tags, stock)
VALUES
(
  'AMD Ryzen 7 9700X',
  'amd-ryzen-7-9700x',
  'AMD', 329.99, 4.8,
  ARRAY['https://m.media-amazon.com/images/I/61SadPOFHnL._AC_SL1500_.jpg'],
  'processeur',
  'Processeur AMD Zen 5, 8 cœurs 16 threads, socket AM5',
  '{"socket":"AM5","cores":8,"threads":16,"tdp":65,"memorySupport":"DDR5"}'::jsonb,
  '{}', 25
),
(
  'AMD Ryzen 9 9900X',
  'amd-ryzen-9-9900x',
  'AMD', 449.99, 4.9,
  ARRAY['https://m.media-amazon.com/images/I/61SadPOFHnL._AC_SL1500_.jpg'],
  'processeur',
  'Processeur AMD Zen 5 haut de gamme, 12 cœurs 24 threads',
  '{"socket":"AM5","cores":12,"threads":24,"tdp":120,"memorySupport":"DDR5"}'::jsonb,
  '{}', 12
),
(
  'AMD Ryzen 5 7600X',
  'amd-ryzen-5-7600x',
  'AMD', 199.99, 4.5,
  ARRAY['https://m.media-amazon.com/images/I/51MC78MSPKL._AC_SL1500_.jpg'],
  'processeur',
  'Processeur AM5 entrée de gamme, 6 cœurs 12 threads DDR5',
  '{"socket":"AM5","cores":6,"threads":12,"tdp":105,"memorySupport":"DDR5"}'::jsonb,
  '{}', 30
),
(
  'Intel Core i7-14700K',
  'intel-core-i7-14700k',
  'Intel', 369.99, 4.7,
  ARRAY['https://m.media-amazon.com/images/I/61s3GNquO-L._AC_SL1500_.jpg'],
  'processeur',
  'Processeur Intel LGA1700 20 cœurs 28 threads DDR4/DDR5',
  '{"socket":"LGA1700","cores":20,"threads":28,"tdp":125,"memorySupport":"DDR4"}'::jsonb,
  '{}', 20
),
(
  'Intel Core i5-14600K',
  'intel-core-i5-14600k',
  'Intel', 259.99, 4.6,
  ARRAY['https://m.media-amazon.com/images/I/51cpbFVNLGL._AC_SL1500_.jpg'],
  'processeur',
  'Processeur Intel LGA1700 14 cœurs 20 threads — excellent rapport qualité/prix',
  '{"socket":"LGA1700","cores":14,"threads":20,"tdp":125,"memorySupport":"DDR4"}'::jsonb,
  '{}', 28
);

-- ============================================================
-- GPUs (gpu)
-- ============================================================
INSERT INTO composants (name, slug, brand, price, rating, images, type, description, specs, tags, stock)
VALUES
(
  'NVIDIA GeForce RTX 4080 Super 16Go',
  'nvidia-rtx-4080-super-16go',
  'NVIDIA', 999.99, 4.9,
  ARRAY['https://m.media-amazon.com/images/I/712h3kkPSCL._AC_SL1500_.jpg'],
  'gpu',
  'Carte graphique NVIDIA Ada Lovelace 16GB GDDR6X PCIe 4.0',
  '{"vram":16,"recommendedPsu":750,"lengthMm":336,"pcieVersion":4,"tdp":320}'::jsonb,
  '{}', 8
),
(
  'NVIDIA GeForce RTX 4070 Ti Super 16Go',
  'nvidia-rtx-4070-ti-super-16go',
  'NVIDIA', 799.99, 4.8,
  ARRAY['https://m.media-amazon.com/images/I/71L6TJU0J1L._AC_SL1500_.jpg'],
  'gpu',
  'Carte graphique 16GB GDDR6X PCIe 4.0 — excellent pour 4K',
  '{"vram":16,"recommendedPsu":700,"lengthMm":317,"pcieVersion":4,"tdp":285}'::jsonb,
  '{}', 12
),
(
  'AMD Radeon RX 7900 XTX 24Go',
  'amd-rx-7900-xtx-24go',
  'AMD', 849.99, 4.7,
  ARRAY['https://m.media-amazon.com/images/I/71AE8NBAXKL._AC_SL1500_.jpg'],
  'gpu',
  'Carte graphique AMD RDNA 3 24GB GDDR6 PCIe 4.0',
  '{"vram":24,"recommendedPsu":800,"lengthMm":287,"pcieVersion":4,"tdp":355}'::jsonb,
  '{}', 6
),
(
  'NVIDIA GeForce RTX 4060 Ti 8Go',
  'nvidia-rtx-4060-ti-8go',
  'NVIDIA', 399.99, 4.5,
  ARRAY['https://m.media-amazon.com/images/I/71FPWv8NFFL._AC_SL1500_.jpg'],
  'gpu',
  'Carte graphique 1080p/1440p PCIe 4.0 compact 8GB',
  '{"vram":8,"recommendedPsu":550,"lengthMm":240,"pcieVersion":4,"tdp":160}'::jsonb,
  '{}', 22
);

-- ============================================================
-- RAM
-- ============================================================
INSERT INTO composants (name, slug, brand, price, rating, images, type, description, specs, tags, stock)
VALUES
(
  'Corsair Vengeance DDR5-6000 32Go (2x16Go)',
  'corsair-vengeance-ddr5-6000-32go',
  'Corsair', 89.99, 4.7,
  ARRAY['https://m.media-amazon.com/images/I/71mWiMkCcVL._AC_SL1500_.jpg'],
  'ram',
  'Kit DDR5 6000MHz CL36 32Go — optimisé Ryzen AM5',
  '{"type":"DDR5","speed":6000,"capacity":16,"sticks":2}'::jsonb,
  '{}', 40
),
(
  'G.Skill Trident Z5 DDR5-6400 64Go (2x32Go)',
  'gskill-trident-z5-ddr5-6400-64go',
  'G.Skill', 159.99, 4.8,
  ARRAY['https://m.media-amazon.com/images/I/71c1tJuq6XL._AC_SL1500_.jpg'],
  'ram',
  'Kit DDR5 6400MHz CL32 64Go haut de gamme',
  '{"type":"DDR5","speed":6400,"capacity":32,"sticks":2}'::jsonb,
  '{}', 18
),
(
  'Corsair Vengeance DDR4-3200 16Go (2x8Go)',
  'corsair-vengeance-ddr4-3200-16go',
  'Corsair', 39.99, 4.6,
  ARRAY['https://m.media-amazon.com/images/I/61n8wMiPlzL._AC_SL1500_.jpg'],
  'ram',
  'Kit DDR4 3200MHz CL16 16Go — compatible Intel LGA1700',
  '{"type":"DDR4","speed":3200,"capacity":8,"sticks":2}'::jsonb,
  '{}', 50
),
(
  'Kingston Fury Beast DDR4-3600 32Go (2x16Go)',
  'kingston-fury-beast-ddr4-3600-32go',
  'Kingston', 64.99, 4.5,
  ARRAY['https://m.media-amazon.com/images/I/81lgmTb-pOL._AC_SL1500_.jpg'],
  'ram',
  'Kit DDR4 3600MHz CL17 32Go — polyvalent Intel DDR4',
  '{"type":"DDR4","speed":3600,"capacity":16,"sticks":2}'::jsonb,
  '{}', 35
);

-- ============================================================
-- PSUs (alimentation)
-- ============================================================
INSERT INTO composants (name, slug, brand, price, rating, images, type, description, specs, tags, stock)
VALUES
(
  'be quiet! Dark Power 13 1000W 80+ Titanium',
  'bequiet-dark-power-13-1000w',
  'be quiet!', 259.99, 4.9,
  ARRAY['https://m.media-amazon.com/images/I/61v1Pz9rRaL._AC_SL1500_.jpg'],
  'alimentation',
  'Alimentation 1000W modulaire 80+ Titanium ultra-silencieuse',
  '{"wattage":1000,"efficiency":"Titanium"}'::jsonb,
  '{}', 10
),
(
  'Corsair RM850x 850W 80+ Gold',
  'corsair-rm850x-850w-gold',
  'Corsair', 149.99, 4.8,
  ARRAY['https://m.media-amazon.com/images/I/71DY7s0BNCL._AC_SL1500_.jpg'],
  'alimentation',
  'Alimentation 850W modulaire 80+ Gold — fiable et silencieuse',
  '{"wattage":850,"efficiency":"Gold"}'::jsonb,
  '{}', 20
),
(
  'Seasonic Focus GX-750 80+ Gold',
  'seasonic-focus-gx-750-gold',
  'Seasonic', 119.99, 4.7,
  ARRAY['https://m.media-amazon.com/images/I/71UKRqkiGzL._AC_SL1500_.jpg'],
  'alimentation',
  'Alimentation 750W modulaire 80+ Gold — rapport qualité/prix excellent',
  '{"wattage":750,"efficiency":"Gold"}'::jsonb,
  '{}', 25
),
(
  'EVGA SuperNOVA 650 G6 80+ Gold',
  'evga-supernova-650-g6-gold',
  'EVGA', 89.99, 4.5,
  ARRAY['https://m.media-amazon.com/images/I/71MGPV8YiZL._AC_SL1500_.jpg'],
  'alimentation',
  'Alimentation 650W compacte 80+ Gold — idéale pour RTX 4060 Ti',
  '{"wattage":650,"efficiency":"Gold"}'::jsonb,
  '{}', 30
);

-- ============================================================
-- CASES (boitier)
-- ============================================================
INSERT INTO composants (name, slug, brand, price, rating, images, type, description, specs, tags, stock)
VALUES
(
  'Fractal Design Torrent ATX',
  'fractal-design-torrent-atx',
  'Fractal Design', 189.99, 4.8,
  ARRAY['https://m.media-amazon.com/images/I/61ZZWZB5kYL._AC_SL1500_.jpg'],
  'boitier',
  'Boîtier ATX haute airflow — supporte GPU jusqu à 461mm',
  '{"maxGpuLength":461,"supportedFormFactors":["ATX","Micro-ATX","Mini-ITX"],"maxCpuCoolerHeight":188}'::jsonb,
  '{}', 14
),
(
  'Lian Li Lancool 216',
  'lian-li-lancool-216',
  'Lian Li', 109.99, 4.7,
  ARRAY['https://m.media-amazon.com/images/I/71AsTXifCpL._AC_SL1500_.jpg'],
  'boitier',
  'Boîtier ATX airflow avec 2 ventilateurs 160mm inclus',
  '{"maxGpuLength":435,"supportedFormFactors":["ATX","Micro-ATX","Mini-ITX"],"maxCpuCoolerHeight":176}'::jsonb,
  '{}', 20
),
(
  'NZXT H5 Flow Compact ATX',
  'nzxt-h5-flow-compact',
  'NZXT', 99.99, 4.6,
  ARRAY['https://m.media-amazon.com/images/I/51a2ZcunfOL._AC_SL1500_.jpg'],
  'boitier',
  'Boîtier ATX compact panneaux perforés — GPU max 365mm',
  '{"maxGpuLength":365,"supportedFormFactors":["ATX","Micro-ATX"],"maxCpuCoolerHeight":165}'::jsonb,
  '{}', 18
),
(
  'Cooler Master MasterBox Q300L Micro-ATX',
  'coolermaster-masterbox-q300l',
  'Cooler Master', 59.99, 4.3,
  ARRAY['https://m.media-amazon.com/images/I/71WF1DLRJJL._AC_SL1500_.jpg'],
  'boitier',
  'Boîtier Micro-ATX compact budget — GPU max 360mm',
  '{"maxGpuLength":360,"supportedFormFactors":["Micro-ATX","Mini-ITX"],"maxCpuCoolerHeight":157}'::jsonb,
  '{}', 25
);

-- ============================================================
-- COOLERS (refroidissement)
-- ============================================================
INSERT INTO composants (name, slug, brand, price, rating, images, type, description, specs, tags, stock)
VALUES
(
  'Noctua NH-D15 chromax.black',
  'noctua-nh-d15-chromax-black',
  'Noctua', 99.99, 4.9,
  ARRAY['https://m.media-amazon.com/images/I/71i9tFKMLLL._AC_SL1500_.jpg'],
  'refroidissement',
  'Ventirad tour double ventilateur — le meilleur air cooler du marché',
  '{"supportedSockets":["AM5","AM4","LGA1700","LGA1200","LGA1151"],"tdpRating":250,"heightMm":165}'::jsonb,
  '{}', 20
),
(
  'be quiet! Dark Rock Pro 4',
  'bequiet-dark-rock-pro-4',
  'be quiet!', 79.99, 4.7,
  ARRAY['https://m.media-amazon.com/images/I/61JEgm8bYiL._AC_SL1500_.jpg'],
  'refroidissement',
  'Ventirad tour double ultra-silencieux 250W TDP',
  '{"supportedSockets":["AM5","AM4","LGA1700","LGA1200","LGA1151"],"tdpRating":250,"heightMm":162}'::jsonb,
  '{}', 15
),
(
  'Arctic Liquid Freezer III 360mm AIO',
  'arctic-liquid-freezer-iii-360',
  'Arctic', 139.99, 4.8,
  ARRAY['https://m.media-amazon.com/images/I/71j0R6BDRHL._AC_SL1500_.jpg'],
  'refroidissement',
  'Watercooling AIO 360mm — performances haut de gamme à prix abordable',
  '{"supportedSockets":["AM5","AM4","LGA1700","LGA1200"],"tdpRating":300,"heightMm":27}'::jsonb,
  '{}', 18
),
(
  'DeepCool AK620 Zero Dark',
  'deepcool-ak620-zero-dark',
  'DeepCool', 54.99, 4.6,
  ARRAY['https://m.media-amazon.com/images/I/71qL3TqY3pL._AC_SL1500_.jpg'],
  'refroidissement',
  'Ventirad tour double 260W TDP — excellent rapport qualité/prix',
  '{"supportedSockets":["AM5","AM4","LGA1700","LGA1200","LGA1151"],"tdpRating":260,"heightMm":160}'::jsonb,
  '{}', 30
);

-- ============================================================
-- STORAGE (stockage)
-- ============================================================
INSERT INTO composants (name, slug, brand, price, rating, images, type, description, specs, tags, stock)
VALUES
(
  'Samsung 990 Pro 2To NVMe PCIe 4.0',
  'samsung-990-pro-2to-nvme',
  'Samsung', 149.99, 4.9,
  ARRAY['https://m.media-amazon.com/images/I/61BVBKJHNML._AC_SL1500_.jpg'],
  'stockage',
  'SSD NVMe M.2 2To — 7450 Mo/s lecture, le meilleur PCIe 4.0',
  '{"type":"NVMe","capacity":2000,"readSpeed":7450,"writeSpeed":6900,"interface":"PCIe 4.0 x4"}'::jsonb,
  '{}', 35
),
(
  'WD Black SN850X 1To NVMe PCIe 4.0',
  'wd-black-sn850x-1to-nvme',
  'Western Digital', 89.99, 4.8,
  ARRAY['https://m.media-amazon.com/images/I/71SEV2RDYNL._AC_SL1500_.jpg'],
  'stockage',
  'SSD NVMe 1To 7300 Mo/s — idéal gaming haute performance',
  '{"type":"NVMe","capacity":1000,"readSpeed":7300,"writeSpeed":6300,"interface":"PCIe 4.0 x4"}'::jsonb,
  '{}', 40
),
(
  'Seagate Barracuda 2To HDD 7200RPM',
  'seagate-barracuda-2to-hdd',
  'Seagate', 49.99, 4.3,
  ARRAY['https://m.media-amazon.com/images/I/71WM+YMFxwL._AC_SL1500_.jpg'],
  'stockage',
  'Disque dur 2To 7200RPM — stockage secondaire à faible coût',
  '{"type":"HDD","capacity":2000,"readSpeed":190,"writeSpeed":190,"interface":"SATA III"}'::jsonb,
  '{}', 60
);
