/**
 * HWstore — PSU form factor patch script
 * Run: npx ts-node -r tsconfig-paths/register src/database/patch-psu-formfactor.ts
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const ds = new DataSource({
  type: 'postgres',
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'hwstore',
  synchronize: false,
});

async function run() {
  await ds.initialize();
  console.log('✅ Connected');

  // All PSUs → formFactor: ATX
  const r1 = await ds.query(
    `UPDATE composants SET specs = specs || '{"formFactor":"ATX"}'::jsonb WHERE type = 'alimentation'`
  );
  console.log(`✅ PSU formFactor patched: ${r1[1]} rows`);

  // Full-size cases → ATX + SFX
  const atkCases = [
    'fractal-design-torrent-atx',
    'lian-li-lancool-216',
    'nzxt-h5-flow-compact',
  ];
  const r2 = await ds.query(
    `UPDATE composants SET specs = specs || '{"supportedPsuTypes":["ATX","SFX"]}'::jsonb
     WHERE slug = ANY($1)`,
    [atkCases],
  );
  console.log(`✅ ATX cases patched: ${r2[1]} rows`);

  // Compact case → ATX + SFX + SFX-L + TFX
  const r3 = await ds.query(
    `UPDATE composants SET specs = specs || '{"supportedPsuTypes":["ATX","SFX","SFX-L","TFX"]}'::jsonb
     WHERE slug = $1`,
    ['coolermaster-masterbox-q300l'],
  );
  console.log(`✅ Compact case patched: ${r3[1]} rows`);

  await ds.destroy();
  console.log('\n🎉 Patch complete.');
}

run().catch(e => { console.error('❌', e.message); process.exit(1); });
