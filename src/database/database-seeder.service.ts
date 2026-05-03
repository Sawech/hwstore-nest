// /**
//  * HWstore — Database Seeder Service
//  * Seeds realistic French product, category, and configurator component data
//  * into PostgreSQL on application startup (only if tables are empty).
//  */

// import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Product } from '../products/product.entity';
// import { Category } from '../category/category.entity';
// import { ConfiguratorComponent } from '../configurator/configurator-component.entity';

// @Injectable()
// export class DatabaseSeederService implements OnApplicationBootstrap {
//   private readonly logger = new Logger(DatabaseSeederService.name);

//   constructor(
//     @InjectRepository(Product)
//     private readonly productsRepo: Repository<Product>,
//     @InjectRepository(Category)
//     private readonly categoryRepo: Repository<Category>,
//     @InjectRepository(ConfiguratorComponent)
//     private readonly componentsRepo: Repository<ConfiguratorComponent>,
//   ) {}

//   async onApplicationBootstrap(): Promise<void> {
//     await this.seedCategory();
//     await this.seedProducts();
//     await this.seedConfiguratorComponents();
//   }

//   // ─── Category ──────────────────────────────────────────
//   private async seedCategory(): Promise<void> {
//     const count = await this.categoryRepo.count();
//     if (count > 0) return;

//     const category: Partial<Category>[] = [
//       {
//         name: 'Ordinateurs Portables',
//         slug: 'ordinateurs-portables',
//         description: 'Puissance et mobilité sans compromis.',
//         image:
//           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbCfgM-E5Nzm-sNtYJr9Nk2nnCC4XQBBW3zQ&s',
//         productCount: 8,
//       },
//       {
//         name: 'Bureau & Gaming',
//         slug: 'bureau-gaming',
//         description: "Des performances taillées pour l'extrême.",
//         image:
//           'https://lh3.googleusercontent.com/aida-public/AB6AXuB4uGNqHGfsxbEDyi0LUA_fndfyP0WI4Oj4eukipyD5mHBV0eWppcD8Vqv0I0XA2b105PB6KGMyVE6fh_GIoW13DcLACSU_ocndJ9u-DVoCJxuaLLHmwZBxjHTUfeGFpnlYKrn1P6UHoPm1o_a7PuSj87xBwWAAzXcr6T-dtR_hqCYEO5Y8sStLs40alPgZQCgDJJd9IUwQ2rSh9CtDhf-ik3amMP5dyqx0XrNLKQNuFRMlOC93d6mi8xR7QYcyh9wQdQ3IMXNmyjw',
//         productCount: 5,
//       },
//       {
//         name: 'Composants',
//         slug: 'composants',
//         description: 'Le cœur de votre infrastructure.',
//         image:
//           'https://campusinformatique.com/wp-content/uploads/2024/04/build-a-gaming-PC.jpeg',
//         productCount: 12,
//       },
//       {
//         name: 'Périphériques',
//         slug: 'peripheriques',
//         description: "L'interface entre vous et la machine.",
//         image:
//           'https://i.pcmag.com/imagery/articles/01gl3CopPfhKhsb6hQrIQLR-1.fit_lim.v1690887121.jpg',
//         productCount: 9,
//       },
//       {
//         name: 'Réseautage & Serveurs',
//         slug: 'reseautage-serveurs',
//         description: 'Connectivité robuste pour entreprises.',
//         image:
//           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxeJAr49gjqIS3x41-OF5b5OG3KrAWEs7wbg&s',
//         productCount: 6,
//       },
//       {
//         name: 'Logiciels & Services',
//         slug: 'logiciels-services',
//         description: 'Optimisation et sécurité logicielle.',
//         image: 'https://scs-dz.com/img/p/1/5/0/0/1500.jpg',
//         productCount: 4,
//       },
//     ];

//     await this.categoryRepo.save(category);
//     this.logger.log(`✅ Seeded ${category.length} category`);
//   }

//   // ─── Products ─────────────────────────────────────────────
//   private async seedProducts(): Promise<void> {
//     const count = await this.productsRepo.count();
//     if (count > 0) return;

//     const products: Partial<Product>[] = [
//       {
//         name: 'Asus ROG Strix G16',
//         slug: 'asus-rog-strix-g16',
//         brand: 'ASUS ROG',
//         subcategory: ['ordinateurs-portables'],
//         price: 245000,
//         rating: 4.9,
//         badge: 'Premium',
//         shortDescription:
//           'Intel Core i9-13900H, 32GB RAM, 1TB SSD. Conçu pour les architectes digitaux.',
//         description:
//           "Le ROG Strix G16 est la machine ultime pour les créateurs et gamers exigeants. Équipé du dernier processeur Intel Core i9 de 13ème génération et d'une RTX 4080 Mobile, il repousse les limites de la performance portable.",
//         images: [
//           'https://cdn.mos.cms.futurecdn.net/qnATrbjvpG6UVWmHYA9jNm-200-80.jpg.webp',
//         ],
//         specs: {
//           cpu: "Intel® Core™ i9-13900H, 24 cœurs, jusqu'à 5.4 GHz",
//           gpu: 'NVIDIA® GeForce RTX™ 4080 12 Go GDDR6',
//           ram: '32 Go DDR5 4800 MHz',
//           storage: '1 To PCIe Gen 4 NVMe SSD',
//           display: '16" QHD+ 240Hz, 100% DCI-P3',
//           battery: '90 Wh',
//           weight: '2.5 kg',
//           wifi: 'Wi-Fi 6E, Bluetooth 5.3',
//           wattage: 180,
//         },
//       },
//       {
//         name: 'Acer Predator Helios Neo 16S',
//         slug: 'acer-predator-helios-neo-16s',
//         brand: 'Acer',
//         subcategory: ['ordinateurs-portables'],
//         price: 310000,
//         rating: 4.8,
//         shortDescription:
//           "Ryzen 9 7940HS, RTX 4070, 16GB DDR5. L'excellence visuelle redéfinie.",
//         description:
//           "L'Acer Predator Helios Neo 16S est une bête de performance équipée du processeur AMD Ryzen 9 7940HS et d'une RTX 4070.",
//         images: [
//           'https://cdn.mos.cms.futurecdn.net/Z8X38UcJoAGXdtk6qSauc7-200-80.jpg.webp',
//         ],
//         specs: {
//           cpu: "AMD Ryzen™ 9 7940HS, 8 cœurs, jusqu'à 5.2 GHz",
//           gpu: 'NVIDIA® GeForce RTX™ 4070 8 Go GDDR6',
//           ram: '16 Go DDR5 5600 MHz',
//           storage: '1 To PCIe Gen 4 NVMe SSD',
//           display: '16" WUXGA 165Hz IPS',
//           battery: '76 Wh',
//           weight: '2.6 kg',
//           wifi: 'Wi-Fi 6E, Bluetooth 5.3',
//           wattage: 150,
//         },
//       },
//       {
//         name: 'ASUS ROG Strix G15',
//         slug: 'asus-rog-strix-g15',
//         brand: 'ASUS ROG',
//         subcategory: ['ordinateurs-portables'],
//         price: 425000,
//         rating: 5.0,
//         badge: 'Nouveau',
//         shortDescription:
//           'Intel Core i7-14700K, 64GB RAM, 2TB SSD. La puissance sans compromis.',
//         description:
//           'Le ROG Strix G15 est la nouvelle référence gaming : 64 Go de RAM DDR5, 2 To NVMe et un écran 300Hz pour une fluidité absolue.',
//         images: [
//           'https://m.media-amazon.com/images/I/71IA+MeLP2L._AC_SL1500_.jpg',
//         ],
//         specs: {
//           cpu: "Intel® Core™ i7-14700HX, 20 cœurs, jusqu'à 5.5 GHz",
//           gpu: 'NVIDIA® GeForce RTX™ 4090 16 Go GDDR6',
//           ram: '64 Go DDR5 5600 MHz',
//           storage: '2 To PCIe Gen 4 NVMe SSD',
//           display: '15.6" FHD 300Hz, 3ms',
//           battery: '90 Wh',
//           weight: '2.3 kg',
//           wifi: 'Wi-Fi 6E, Bluetooth 5.3',
//           wattage: 200,
//         },
//       },
//       {
//         name: 'Lenovo LOQ 15',
//         slug: 'lenovo-loq-15',
//         brand: 'Lenovo',
//         subcategory: ['ordinateurs-portables'],
//         price: 165000,
//         rating: 4.9,
//         shortDescription:
//           'Core i5, 12h Autonomie, 0.9kg. La mobilité redéfinie.',
//         description:
//           'Le Lenovo LOQ 15 est le choix idéal pour les étudiants et professionnels cherchant un excellent rapport qualité-prix.',
//         images: [
//           'https://cdn.mos.cms.futurecdn.net/VihZ2jCgC93t9nfuVUHcRQ-200-80.jpg.webp',
//         ],
//         specs: {
//           cpu: "Intel® Core™ i5-13420H, 12 cœurs, jusqu'à 4.6 GHz",
//           gpu: 'NVIDIA® GeForce RTX™ 4060 8 Go',
//           ram: '16 Go DDR5 4800 MHz',
//           storage: '512 Go PCIe NVMe SSD',
//           display: '15.6" FHD 144Hz IPS',
//           battery: "60 Wh — jusqu'à 12h",
//           weight: '2.4 kg',
//           wifi: 'Wi-Fi 6, Bluetooth 5.1',
//           wattage: 115,
//         },
//       },
//       {
//         name: 'Acer Nitro V 16',
//         slug: 'acer-nitro-v-16',
//         brand: 'Acer',
//         subcategory: ['ordinateurs-portables'],
//         price: 198500,
//         rating: 4.7,
//         shortDescription:
//           'i7-13650HX, RTX 4060, 144Hz Display. Conçu pour la victoire.',
//         description:
//           "L'Acer Nitro V 16 combine performance gaming et design agressif.",
//         images: [
//           'https://cdn.mos.cms.futurecdn.net/Q5XbkE8ANr5MxQLEuPmpCe-200-80.jpg.webp',
//         ],
//         specs: {
//           cpu: "Intel® Core™ i7-13650HX, 14 cœurs, jusqu'à 4.9 GHz",
//           gpu: 'NVIDIA® GeForce RTX™ 4060 8 Go',
//           ram: '16 Go DDR5 4800 MHz',
//           storage: '512 Go PCIe NVMe SSD',
//           display: '16" WUXGA 144Hz IPS',
//           battery: '76 Wh',
//           weight: '2.6 kg',
//           wifi: 'Wi-Fi 6, Bluetooth 5.1',
//           wattage: 150,
//         },
//       },
//       {
//         name: 'Acer Predator Helios Neo 16S Pro',
//         slug: 'acer-predator-helios-neo-16s-pro',
//         brand: 'Acer',
//         subcategory: ['ordinateurs-portables'],
//         price: 785000,
//         rating: 4.8,
//         badge: 'Elite',
//         shortDescription:
//           'RTX A5000, 128GB RAM, 4K OLED. Le sanctuaire des créatifs.',
//         description:
//           'Une station de travail mobile sans compromis avec un écran OLED 4K calibré Pantone et 128 Go de RAM ECC.',
//         images: [
//           'https://cdn.mos.cms.futurecdn.net/VBchQcTLyqGwFgetQctHzQ-200-80.jpg.webp',
//         ],
//         specs: {
//           cpu: "Intel® Core™ i9-14900HX, 24 cœurs, jusqu'à 5.8 GHz",
//           gpu: 'NVIDIA® RTX™ A5000 16 Go GDDR6',
//           ram: '128 Go DDR5 5600 MHz ECC',
//           storage: '4 To PCIe Gen 4 NVMe SSD (RAID 0)',
//           display: '16" 4K OLED 120Hz, Pantone Validated',
//           battery: '99.9 Wh',
//           weight: '3.1 kg',
//           wifi: 'Wi-Fi 6E, Bluetooth 5.3',
//           wattage: 230,
//         },
//       },
//       {
//         name: 'Asus TUF F16',
//         slug: 'asus-tuf-f16',
//         brand: 'ASUS',
//         subcategory: ['ordinateurs-portables'],
//         price: 142000,
//         rating: 4.6,
//         shortDescription:
//           "Intel Evo i5, 16GB RAM, WiFi 6E. L'essentiel de l'entreprise.",
//         description:
//           'Le TUF F16 offre durabilité militaire et performances gaming équilibrées dans un châssis robuste certifié MIL-STD-810H.',
//         images: [
//           'https://cdn.mos.cms.futurecdn.net/Tf3aek2UgmAMaLLkvAQbQG-200-80.jpg.webp',
//         ],
//         specs: {
//           cpu: "Intel® Core™ i5-13500HX, 14 cœurs, jusqu'à 4.7 GHz",
//           gpu: 'NVIDIA® GeForce RTX™ 4060 8 Go',
//           ram: '16 Go DDR5',
//           storage: '512 Go NVMe SSD',
//           display: '16" FHD 144Hz IPS',
//           battery: '72 Wh',
//           weight: '2.2 kg',
//           wifi: 'Wi-Fi 6E, Bluetooth 5.3',
//           wattage: 115,
//         },
//       },
//       {
//         name: 'MSI Vector 16 HX',
//         slug: 'msi-vector-16-hx',
//         brand: 'MSI',
//         subcategory: ['ordinateurs-portables'],
//         price: 825000,
//         rating: 4.9,
//         badge: 'Elite',
//         shortDescription:
//           'The ultimate workstation. i9 Extreme, Dual SSD, liquid cooling tech.',
//         description:
//           'Le MSI Vector 16 HX est LA référence ultime du gaming portable.',
//         images: [
//           'https://cdn.mos.cms.futurecdn.net/eDJ9awmTBZDzn3gZzfDPAV-200-80.jpg.webp',
//         ],
//         specs: {
//           cpu: "Intel® Core™ i9-14900HX, 24 cœurs, jusqu'à 5.8 GHz",
//           gpu: 'NVIDIA® GeForce RTX™ 4090 16 Go GDDR6X',
//           ram: '64 Go DDR5 7200 MHz',
//           storage: '2x 2 To PCIe Gen 4 NVMe (RAID)',
//           display: '16" QHD+ 240Hz Mini-LED',
//           battery: '99.9 Wh',
//           weight: '2.8 kg',
//           wifi: 'Wi-Fi 6E (802.11ax), Bluetooth 5.3',
//           wattage: 250,
//         },
//       },
//     ];

//     await this.productsRepo.save(products);
//     this.logger.log(`✅ Seeded ${products.length} products`);
//   }

//   // ─── Configurator Components ──────────────────────────────
//   private async seedConfiguratorComponents(): Promise<void> {
//     const count = await this.componentsRepo.count();
//     if (count > 0) return;

//     const components: Partial<ConfiguratorComponent>[] = [
//       // Boîtiers
//       {
//         type: 'boitier',
//         name: 'Fractal Design North',
//         price: 15400,
//         tags: ['Mid Tower', 'E-ATX Support'],
//         description: 'Châssis élégant avec accents en bois naturel.',
//         image:
//           'https://lh3.googleusercontent.com/aida-public/AB6AXuCqZhEj9VZ9yO9y_seaUBjVA9mecevbkK38p2I3W3wpCcuXrZZESed9WeyUdIMsx_DtVy1eAJTslvOhvdwQjOB9eXa25K-cVk4k5YCzX2nzo8vOAqdtDuISioIEBQgeG2s57TMORtvSwA0bvTzGwc9Nw9rka7PniwRwb_FYimU2HSNgaEfWPZJGlEPX2pThMDqKguKLRFoWOgjllFxH-5XAdeM5ecc8-az6GF4qrnuEIZPS1Dt0znBAuI-bz69SPOr21HgpQZo2NSY',
//         wattage: 0,
//       },
//       {
//         type: 'boitier',
//         name: 'NZXT H7 Flow White',
//         price: 12900,
//         tags: ['ATX', 'Mesh Panel'],
//         description: 'Design iconique ultra-minimaliste. Panneaux perforés.',
//         image:
//           'https://lh3.googleusercontent.com/aida-public/AB6AXuAcPPFO7FCflvXTIs70iQTwKk_Zskdsyj_-zwKbwtrU6NTlcSLqrx7o9OdSowlabgMyQDh9nOfKj6kbxNVX47g2dSSie5tlMUpV529lbHJMn6CHT8pz9g1HRSJCdtjbD2yZ_SdTHvaCrnfG_5dlpTEZP8uR96zJqLoZXIMDwxZ7i-o2kRY573IFjGHpk6eLt41bkYNZyFyBz9qrczrUmCCjYGPBAxkVCCzxmR5Khrym0tHTA-CSb9_aF_oGohamaVsLzXRQ3soFrH0',
//         wattage: 0,
//       },
//       {
//         type: 'boitier',
//         name: 'Corsair 7000D Airflow',
//         price: 28500,
//         tags: ['Full Tower', 'Watercooling Ready'],
//         description: "L'architecture ultime pour les builds extrêmes.",
//         image:
//           'https://lh3.googleusercontent.com/aida-public/AB6AXuBAOLIdJWPrkpOlZb6zjCQtC1-Dh1aLYRSiV0woHdx8Xf7ouX086WuN-ToeouGY6J-eYWWNIsqHWUEeEj_9gcjwQkc5DZh2cxeNoa2oU5Y6PbbdrvOA7kyLsebPy-o3bVAh9wqak8rAjAClgqz2bRa7lSJwcd3ZXl5MKsy0mqf7s7HyRqt7FaEFsXSrNpMpXXiLWzqEEX32pGdv6Segv6xz0ocOWFZPGg-JuRkYY5IQEBckwfnqwk1_sUHSEtQvONOgmyyAm9SHM_U',
//         wattage: 0,
//       },
//       // Processeurs
//       {
//         type: 'processeur',
//         name: 'Intel Core i9-14900K',
//         price: 45000,
//         tags: ['LGA 1700', 'DDR5', '125W TDP'],
//         description: '24 cœurs (8P+16E), 5.8 GHz boost. La référence gaming.',
//         image:
//           'https://m.media-amazon.com/images/I/61WTq5OlYbL._AC_SL1500_.jpg',
//         wattage: 125,
//       },
//       {
//         type: 'processeur',
//         name: 'AMD Ryzen 9 7950X',
//         price: 42000,
//         tags: ['AM5', 'DDR5', '170W TDP'],
//         description:
//           '16 cœurs, 5.7 GHz boost. Champion des workstations créatives.',
//         image:
//           'https://m.media-amazon.com/images/I/61b3yPHfLwL._AC_SL1500_.jpg',
//         wattage: 170,
//       },
//       {
//         type: 'processeur',
//         name: 'Intel Core i7-14700K',
//         price: 32000,
//         tags: ['LGA 1700', 'DDR5', '125W TDP'],
//         description: '20 cœurs (8P+12E), 5.6 GHz boost. Excellent rapport P/P.',
//         image:
//           'https://m.media-amazon.com/images/I/61WTq5OlYbL._AC_SL1500_.jpg',
//         wattage: 125,
//       },
//       // Cartes mères
//       {
//         type: 'carte-mere',
//         name: 'ASUS ROG Strix Z790-E',
//         price: 35000,
//         tags: ['ATX', 'DDR5', 'PCIe 5.0'],
//         description: 'ATX DDR5, PCIe 5.0 x16, Wi-Fi 6E intégré.',
//         image:
//           'https://m.media-amazon.com/images/I/81YrXiqPYOL._AC_SL1500_.jpg',
//         wattage: 20,
//       },
//       {
//         type: 'carte-mere',
//         name: 'MSI MAG B650 Tomahawk',
//         price: 22000,
//         tags: ['ATX', 'AM5', 'DDR5'],
//         description: 'AM5 DDR5, excellent VRM pour overclock Ryzen.',
//         image:
//           'https://m.media-amazon.com/images/I/81YrXiqPYOL._AC_SL1500_.jpg',
//         wattage: 18,
//       },
//       // RAM
//       {
//         type: 'ram',
//         name: 'Corsair Vengeance 16 Go DDR5',
//         price: 12000,
//         tags: ['DDR5 6000', 'CL36', 'XMP 3.0'],
//         description: '16 Go (2x8 Go) DDR5 6000 MHz CL36.',
//         image:
//           'https://m.media-amazon.com/images/I/61TqXq6MTML._AC_SL1500_.jpg',
//         wattage: 5,
//       },
//       {
//         type: 'ram',
//         name: 'G.Skill Trident Z5 32 Go DDR5',
//         price: 24000,
//         tags: ['DDR5 6400', 'CL32', 'XMP 3.0'],
//         description:
//           '32 Go DDR5 6400 MHz CL32. La RAM premium pour les workstations.',
//         image:
//           'https://m.media-amazon.com/images/I/61TqXq6MTML._AC_SL1500_.jpg',
//         wattage: 8,
//       },
//       {
//         type: 'ram',
//         name: 'Kingston Fury Beast 64 Go DDR5',
//         price: 48000,
//         tags: ['DDR5 5600', '4 barrettes'],
//         description:
//           '64 Go DDR5 pour les renders 3D et la virtualisation extrême.',
//         image:
//           'https://m.media-amazon.com/images/I/61TqXq6MTML._AC_SL1500_.jpg',
//         wattage: 15,
//       },
//       // Stockage
//       {
//         type: 'stockage',
//         name: 'Samsung 990 Pro 1 To NVMe',
//         price: 8000,
//         tags: ['PCIe 4.0', '7450 Mo/s', 'M.2 2280'],
//         description:
//           'PCIe Gen 4 NVMe — 7450 Mo/s lecture. La référence absolue.',
//         image:
//           'https://m.media-amazon.com/images/I/61EVtKfqPRL._AC_SL1500_.jpg',
//         wattage: 5,
//       },
//       {
//         type: 'stockage',
//         name: 'WD Black SN850X 2 To NVMe',
//         price: 15000,
//         tags: ['PCIe 4.0', '7300 Mo/s'],
//         description: 'PCIe Gen 4 — 7300 Mo/s, 2 To.',
//         image:
//           'https://m.media-amazon.com/images/I/61EVtKfqPRL._AC_SL1500_.jpg',
//         wattage: 6,
//       },
//       {
//         type: 'stockage',
//         name: 'Seagate FireCuda 4 To NVMe',
//         price: 28000,
//         tags: ['PCIe 5.0', '10 Go/s', '4 To'],
//         description: "PCIe Gen 5 — jusqu'à 10 Go/s. 4 To nouvelle génération.",
//         image:
//           'https://m.media-amazon.com/images/I/61EVtKfqPRL._AC_SL1500_.jpg',
//         wattage: 8,
//       },
//       // GPU
//       {
//         type: 'gpu',
//         name: 'NVIDIA RTX 4090 24 Go',
//         price: 180000,
//         tags: ['PCIe 4.0 x16', '450W TDP', 'DLSS 3'],
//         description:
//           '24 Go GDDR6X, 16384 CUDA cores. La plus puissante du marché.',
//         image:
//           'https://m.media-amazon.com/images/I/81pYHiRbElL._AC_SL1500_.jpg',
//         wattage: 450,
//       },
//       {
//         type: 'gpu',
//         name: 'NVIDIA RTX 4080 Super 16 Go',
//         price: 120000,
//         tags: ['PCIe 4.0 x16', '320W TDP', 'DLSS 3'],
//         description: '16 Go GDDR6X. Performance 4K ultra.',
//         image:
//           'https://m.media-amazon.com/images/I/81pYHiRbElL._AC_SL1500_.jpg',
//         wattage: 320,
//       },
//       {
//         type: 'gpu',
//         name: 'NVIDIA RTX 4070 Ti Super 16 Go',
//         price: 85000,
//         tags: ['PCIe 4.0 x16', '285W TDP', 'DLSS 3'],
//         description: 'Excellent rapport performance/prix en 1440p.',
//         image:
//           'https://m.media-amazon.com/images/I/81pYHiRbElL._AC_SL1500_.jpg',
//         wattage: 285,
//       },
//       // Alimentation
//       {
//         type: 'alimentation',
//         name: 'Corsair RM850x GOLD',
//         price: 22000,
//         tags: ['850W', '80+ Gold', 'Full Modulaire'],
//         description:
//           '850W 80+ Gold, entièrement modulaire. Silence et stabilité.',
//         image:
//           'https://m.media-amazon.com/images/I/81oavbMYkWL._AC_SL1500_.jpg',
//         wattage: 0,
//       },
//       {
//         type: 'alimentation',
//         name: 'be quiet! Dark Power 13 1000W',
//         price: 35000,
//         tags: ['1000W', '80+ Titanium', 'ATX 3.0'],
//         description:
//           '1000W 80+ Titanium, ultra-silencieux. La référence des builds extrêmes.',
//         image:
//           'https://m.media-amazon.com/images/I/81oavbMYkWL._AC_SL1500_.jpg',
//         wattage: 0,
//       },
//       // Refroidissement
//       {
//         type: 'refroidissement',
//         name: 'be quiet! Dark Rock Pro 5',
//         price: 8500,
//         tags: ['Air Cooling', 'TDP 250W', 'Double Fan'],
//         description: 'Ventirad double tour ultra-silencieux.',
//         image:
//           'https://m.media-amazon.com/images/I/71FMc6GKFVL._AC_SL1500_.jpg',
//         wattage: 5,
//       },
//       {
//         type: 'refroidissement',
//         name: 'NZXT Kraken 360 AIO',
//         price: 18000,
//         tags: ['AIO 360mm', 'LCD Display', 'Pompe 6e gen'],
//         description:
//           'Watercooling 360mm, parfait pour les overclocks extrêmes.',
//         image:
//           'https://m.media-amazon.com/images/I/71FMc6GKFVL._AC_SL1500_.jpg',
//         wattage: 10,
//       },
//     ];

//     await this.componentsRepo.save(components);
//     this.logger.log(`✅ Seeded ${components.length} configurator components`);
//   }
// }
