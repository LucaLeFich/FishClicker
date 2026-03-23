// ── State ──────────────────────────────────────────────────────────────────
const state = {
  fish: 0,
  allTimeFish: 0,
  clickPower: 1,
  fishPerSec: 0,
  buyQty: 1,
  clickCount: 0,
  lastClickTime: Date.now(),
  rockyCount: 0,
  // Blackjack stats
  bjHands: 0, bjWins: 0, bjLosses: 0, bjPushes: 0, bjBlackjacks: 0,
  bjWagered: 0, bjWon: 0, bjBiggestWin: 0, bjBestStreak: 0,
  // Roulette stats
  rlSpins: 0, rlWins: 0, rlLosses: 0,
  rlWagered: 0, rlWon: 0, rlBiggestWin: 0, rlBestStreak: 0,
};

// ── Buildings ──────────────────────────────────────────────────────────────
const BUILDINGS = [
  { id: 'rod',       name: 'Fishing Rod',      icon: '🎣', baseCost: 25,           baseFps: 0.1,      desc: 'A humble rod. Every fisherman starts somewhere.',                         count: 0 },
  { id: 'net',       name: 'Fishing Net',      icon: '🥅', baseCost: 200,          baseFps: 0.4,      desc: 'Cast wide, catch more. Simple math.',                                     count: 0 },
  { id: 'boat',      name: 'Rowboat',          icon: '🚣', baseCost: 1000,         baseFps: 1.5,      desc: 'Row, row, row your boat — full of fish.',                                 count: 0 },
  { id: 'dock',      name: 'Fish Dock',        icon: '🏚️', baseCost: 5000,         baseFps: 6,        desc: 'A proper dock with hired fishers working shifts.',                        count: 0 },
  { id: 'farm',      name: 'Fish Farm',        icon: '🐠', baseCost: 25000,        baseFps: 20,       desc: 'Sustainably farmed salmon. Mostly sustainably.',                          count: 0 },
  { id: 'trawler',   name: 'Trawler',          icon: '🛥️', baseCost: 150000,       baseFps: 75,       desc: 'Industrial trawling. The ocean trembles.',                                count: 0 },
  { id: 'submarine', name: 'Submarine',        icon: '🤿', baseCost: 750000,       baseFps: 300,      desc: 'Hunting the deep. Sonar pings fill the abyss.',                           count: 0 },
  { id: 'portal',    name: 'Fish Portal',      icon: '🌀', baseCost: 5000000,      baseFps: 1200,     desc: 'A rift to a dimension made entirely of fish.',                            count: 0 },
  { id: 'deity',     name: 'Ocean Deity',      icon: '🐙', baseCost: 40000000,     baseFps: 4500,     desc: 'An ancient leviathan, now in your employment.',                           count: 0 },
  { id: 'kraken',    name: 'Kraken',           icon: '🦑', baseCost: 300000000,    baseFps: 20000,    desc: 'It was never a myth. It just needed a manager.',                          count: 0 },
  { id: 'fishdim',   name: 'Fish Dimension',   icon: '🔭', baseCost: 2000000000,   baseFps: 90000,    desc: 'A parallel universe colonised entirely by fish. Rent is surprisingly cheap.', count: 0 },
  { id: 'timepond',  name: 'Time Pond',        icon: '⏳', baseCost: 15000000000,  baseFps: 375000,   desc: 'Fish from the past, present, and future arrive simultaneously. Scheduling nightmare.', count: 0 },
  { id: 'fishstar',  name: 'Fish Star',        icon: '⭐', baseCost: 100000000000, baseFps: 1600000,  desc: 'A star made of compressed fish. Warm. Smells indescribable.',             count: 0 },
];

// ── Upgrades ───────────────────────────────────────────────────────────────
const UPGRADES = [
  // ── Click upgrades ──
  { id: 'u_click1',  name: 'Better Hook',           cost: 250,         desc: '2× click power.',                        bought: false, type: 'click', mult: 2,   req: () => state.allTimeFish >= 50 },
  { id: 'u_click2',  name: 'Titanium Hook',          cost: 3000,        desc: '2× click power.',                        bought: false, type: 'click', mult: 2,   req: () => state.allTimeFish >= 500 },
  { id: 'u_click3',  name: 'Enchanted Lure',         cost: 30000,       desc: '5× click power.',                        bought: false, type: 'click', mult: 5,   req: () => state.allTimeFish >= 8000 },
  { id: 'u_click4',  name: 'Quantum Bait',           cost: 600000,      desc: '10× click power.',                       bought: false, type: 'click', mult: 10,  req: () => state.allTimeFish >= 200000 },
  { id: 'u_click5',  name: "Poseidon's Rod",         cost: 15000000,    desc: '10× click power.',                       bought: false, type: 'click', mult: 10,  req: () => state.allTimeFish >= 2000000 },
  { id: 'u_click6',  name: 'Cosmic Bait',            cost: 400000000,   desc: '20× click power.',                       bought: false, type: 'click', mult: 20,  req: () => state.allTimeFish >= 50000000 },
  // ── Rod upgrades ──
  { id: 'u_rod1',    name: 'Carbon Fibre Rod',       cost: 600,         desc: 'Fishing Rods produce 2× more.',          bought: false, type: 'building', target: 'rod',       mult: 2, req: () => getBldg('rod').count >= 5 },
  { id: 'u_rod2',    name: 'Telescopic Rod',         cost: 6000,        desc: 'Fishing Rods produce 2× more.',          bought: false, type: 'building', target: 'rod',       mult: 2, req: () => getBldg('rod').count >= 15 },
  { id: 'u_rod3',    name: 'Nano-fibre Rod',         cost: 50000,       desc: 'Fishing Rods produce 2× more.',          bought: false, type: 'building', target: 'rod',       mult: 2, req: () => getBldg('rod').count >= 25 },
  // ── Net upgrades ──
  { id: 'u_net1',    name: 'Silk Net',               cost: 3000,        desc: 'Fishing Nets produce 2× more.',          bought: false, type: 'building', target: 'net',       mult: 2, req: () => getBldg('net').count >= 5 },
  { id: 'u_net2',    name: 'Electrified Net',        cost: 35000,       desc: 'Fishing Nets produce 2× more.',          bought: false, type: 'building', target: 'net',       mult: 2, req: () => getBldg('net').count >= 15 },
  { id: 'u_net3',    name: 'Quantum Mesh',           cost: 250000,      desc: 'Fishing Nets produce 2× more.',          bought: false, type: 'building', target: 'net',       mult: 2, req: () => getBldg('net').count >= 25 },
  // ── Boat upgrades ──
  { id: 'u_boat1',   name: 'Outboard Motor',         cost: 15000,       desc: 'Rowboats produce 2× more.',              bought: false, type: 'building', target: 'boat',      mult: 2, req: () => getBldg('boat').count >= 5 },
  { id: 'u_boat2',   name: 'Autopilot',              cost: 150000,      desc: 'Rowboats produce 2× more.',              bought: false, type: 'building', target: 'boat',      mult: 2, req: () => getBldg('boat').count >= 15 },
  { id: 'u_boat3',   name: 'Turbo Propeller',        cost: 1000000,     desc: 'Rowboats produce 2× more.',              bought: false, type: 'building', target: 'boat',      mult: 2, req: () => getBldg('boat').count >= 25 },
  // ── Dock upgrades ──
  { id: 'u_dock1',   name: 'Union Workers',          cost: 75000,       desc: 'Fish Docks produce 2× more.',            bought: false, type: 'building', target: 'dock',      mult: 2, req: () => getBldg('dock').count >= 5 },
  { id: 'u_dock2',   name: 'Crane System',           cost: 650000,      desc: 'Fish Docks produce 2× more.',            bought: false, type: 'building', target: 'dock',      mult: 2, req: () => getBldg('dock').count >= 15 },
  { id: 'u_dock3',   name: 'Automated Conveyor',     cost: 5000000,     desc: 'Fish Docks produce 2× more.',            bought: false, type: 'building', target: 'dock',      mult: 2, req: () => getBldg('dock').count >= 25 },
  // ── Farm upgrades ──
  { id: 'u_farm1',   name: 'Premium Feed',           cost: 300000,      desc: 'Fish Farms produce 2× more.',            bought: false, type: 'building', target: 'farm',      mult: 2, req: () => getBldg('farm').count >= 5 },
  { id: 'u_farm2',   name: 'Genetic Optimisation',   cost: 2500000,     desc: 'Fish Farms produce 2× more.',            bought: false, type: 'building', target: 'farm',      mult: 2, req: () => getBldg('farm').count >= 15 },
  { id: 'u_farm3',   name: 'Hatchery Drones',        cost: 18000000,    desc: 'Fish Farms produce 2× more.',            bought: false, type: 'building', target: 'farm',      mult: 2, req: () => getBldg('farm').count >= 25 },
  // ── Trawler upgrades ──
  { id: 'u_trawl1',  name: 'Sonar Array',            cost: 1500000,     desc: 'Trawlers produce 2× more.',              bought: false, type: 'building', target: 'trawler',   mult: 2, req: () => getBldg('trawler').count >= 5 },
  { id: 'u_trawl2',  name: 'Deep-sea Radar',         cost: 10000000,    desc: 'Trawlers produce 2× more.',              bought: false, type: 'building', target: 'trawler',   mult: 2, req: () => getBldg('trawler').count >= 15 },
  { id: 'u_trawl3',  name: 'Meganet Deployment',     cost: 70000000,    desc: 'Trawlers produce 2× more.',              bought: false, type: 'building', target: 'trawler',   mult: 2, req: () => getBldg('trawler').count >= 25 },
  // ── Submarine upgrades ──
  { id: 'u_sub1',    name: 'Torpedo Nets',           cost: 10000000,    desc: 'Submarines produce 2× more.',            bought: false, type: 'building', target: 'submarine', mult: 2, req: () => getBldg('submarine').count >= 5 },
  { id: 'u_sub2',    name: 'Pressure Harvester',     cost: 70000000,    desc: 'Submarines produce 2× more.',            bought: false, type: 'building', target: 'submarine', mult: 2, req: () => getBldg('submarine').count >= 15 },
  { id: 'u_sub3',    name: 'Nuclear Fish Drive',     cost: 500000000,   desc: 'Submarines produce 2× more.',            bought: false, type: 'building', target: 'submarine', mult: 2, req: () => getBldg('submarine').count >= 25 },
  // ── Portal upgrades ──
  { id: 'u_portal1', name: 'Rift Stabiliser',        cost: 60000000,    desc: 'Fish Portals produce 2× more.',          bought: false, type: 'building', target: 'portal',    mult: 2, req: () => getBldg('portal').count >= 5 },
  { id: 'u_portal2', name: 'Dimensional Antenna',    cost: 400000000,   desc: 'Fish Portals produce 2× more.',          bought: false, type: 'building', target: 'portal',    mult: 2, req: () => getBldg('portal').count >= 15 },
  { id: 'u_portal3', name: 'Multiverse Fishing Permit', cost: 3000000000, desc: 'Fish Portals produce 2× more.',        bought: false, type: 'building', target: 'portal',    mult: 2, req: () => getBldg('portal').count >= 25 },
  // ── Deity upgrades ──
  { id: 'u_deity1',  name: 'Divine Offering',        cost: 400000000,   desc: 'Ocean Deities produce 2× more.',         bought: false, type: 'building', target: 'deity',     mult: 2, req: () => getBldg('deity').count >= 5 },
  { id: 'u_deity2',  name: 'Eldritch Contract',      cost: 3000000000,  desc: 'Ocean Deities produce 2× more.',         bought: false, type: 'building', target: 'deity',     mult: 2, req: () => getBldg('deity').count >= 15 },
  { id: 'u_deity3',  name: 'Abyssal Pact',           cost: 20000000000, desc: 'Ocean Deities produce 2× more.',         bought: false, type: 'building', target: 'deity',     mult: 2, req: () => getBldg('deity').count >= 25 },
  // ── Kraken upgrades ──
  { id: 'u_krak1',   name: 'Extra Tentacles',        cost: 3000000000,  desc: 'Krakens produce 2× more.',               bought: false, type: 'building', target: 'kraken',    mult: 2, req: () => getBldg('kraken').count >= 5 },
  { id: 'u_krak2',   name: 'HR-Approved Whirlpool',  cost: 20000000000, desc: 'Krakens produce 2× more.',               bought: false, type: 'building', target: 'kraken',    mult: 2, req: () => getBldg('kraken').count >= 15 },
  // ── Fish Dimension upgrades ──
  { id: 'u_fdim1',   name: 'Dimensional Import Tax', cost: 20000000000, desc: 'Fish Dimensions produce 2× more.',       bought: false, type: 'building', target: 'fishdim',   mult: 2, req: () => getBldg('fishdim').count >= 5 },
  { id: 'u_fdim2',   name: 'Inter-dimensional Bypass', cost: 120000000000, desc: 'Fish Dimensions produce 2× more.',   bought: false, type: 'building', target: 'fishdim',   mult: 2, req: () => getBldg('fishdim').count >= 15 },
  // ── Time Pond upgrades ──
  { id: 'u_time1',   name: 'Paradox Insurance',      cost: 150000000000, desc: 'Time Ponds produce 2× more.',           bought: false, type: 'building', target: 'timepond',  mult: 2, req: () => getBldg('timepond').count >= 5 },
  { id: 'u_time2',   name: 'Grandfather Clause',     cost: 900000000000, desc: 'Time Ponds produce 2× more.',           bought: false, type: 'building', target: 'timepond',  mult: 2, req: () => getBldg('timepond').count >= 15 },
  // ── Fish Star upgrades ──
  { id: 'u_star1',   name: 'Solar Gill Panels',      cost: 1000000000000, desc: 'Fish Stars produce 2× more.',          bought: false, type: 'building', target: 'fishstar',  mult: 2, req: () => getBldg('fishstar').count >= 5 },
  { id: 'u_star2',   name: 'Stellar Compression',    cost: 6000000000000, desc: 'Fish Stars produce 2× more.',          bought: false, type: 'building', target: 'fishstar',  mult: 2, req: () => getBldg('fishstar').count >= 15 },
  // ── Global multipliers ──
  { id: 'u_global1', name: 'Marine Biology Degree',  cost: 150000,      desc: 'All production ×1.5.',                   bought: false, type: 'global', mult: 1.5, req: () => state.allTimeFish >= 75000 },
  { id: 'u_global2', name: 'Ocean Almanac',          cost: 2000000,     desc: 'All production ×2.',                     bought: false, type: 'global', mult: 2,   req: () => state.allTimeFish >= 750000 },
  { id: 'u_global3', name: "Poseidon's Blessing",    cost: 20000000,    desc: 'All production ×3.',                     bought: false, type: 'global', mult: 3,   req: () => state.allTimeFish >= 8000000 },
  { id: 'u_global4', name: 'Oceanic Singularity',    cost: 300000000,   desc: 'All production ×2.',                     bought: false, type: 'global', mult: 2,   req: () => state.allTimeFish >= 100000000 },
  { id: 'u_global5', name: 'The Fish Theorem',       cost: 4000000000,  desc: 'All production ×3.',                     bought: false, type: 'global', mult: 3,   req: () => state.allTimeFish >= 800000000 },
  { id: 'u_global6', name: 'Unified Fish Theory',    cost: 100000000000, desc: 'All production ×5.',                    bought: false, type: 'global', mult: 5,   req: () => state.allTimeFish >= 8000000000 },
];

const NEWS_LINES = [
  'Welcome to FishClicker! Click the fish to start your fishing empire.',
  'Local fisherman catches record-breaking 10,000 fish. Wife still unimpressed.',
  'Scientists discover fish that clicks back. Awarded Nobel Prize in Confusion.',
  'Ocean declares war on idle games. Casualties include one browser tab.',
  'FishClicker player ascends to godhood, still wants more fish.',
  'Economists baffled as fish supply exceeds global demand by factor of eight million.',
  '"I can quit anytime," says man surrounded by 50 trawlers and a kraken on retainer.',
  'Fish portal opens downtown. Seagulls declared a national emergency.',
  'Ocean Deity files for overtime pay. HR meeting scheduled for Thursday.',
  'Breaking: fish now outnumber stars in the observable universe. Astronomers switching careers.',
  'Area man clicks fish 14,000 times. Doctors confirm his index finger "technically counts as a weapon."',
  'Kraken spotted wearing a hard hat. Sources say it is middle management now.',
  'Fish Farm achieves sentience. Issues press release demanding dental coverage.',
  'Time Pond causes grandfather to arrive late to his own birth. Paradox insurance claim pending.',
  'Local trawler captain insists he is "definitely not addicted." Has 847 trawlers.',
  'Fish Dimension rent prices soar. Landlord cited as "just a slightly bigger fish."',
  'Fish Star reaches surface temperature of 6,000°C. Local fishermen call it "a bit nippy."',
  'Government proposes fish-based currency. Central bank says it smells like a good idea.',
  'Marine biologist resigns after discovering fish are running the economy.',
  'Submarine crew reports fish on the outside waving back. Mission classified.',
  'Quantum Bait observed existing in two hooks simultaneously. Physics weeps.',
  'Ocean Deity requests performance review. Reviewer has not been seen since.',
  '"The fish hired me," admits CEO of major shipping company.',
  'Fish portal upgrade delayed. Contractor says the rift was "not up to code."',
  'Man buys 100th fishing rod. Neighbours describe him as "reel obsessed."',
  'Fish Almanac updated. New entry: "you." Description: concerning.',
  'Kraken HR memo leaked: "Tentacle hygiene is non-negotiable in client meetings."',
  'Scientists confirm fish have been collectively pretending not to understand economics.',
  'Time Pond glitch sends 40 fish to the Jurassic era. They adapt immediately.',
  'Breaking: the ocean calls. It wants its fish back. You decline.',
  'Local gambler bets entire trawler fleet on blackjack. Dealer had 21. Fleet gone.',
  'Gambling Den reports record profits. Player insists they were "definitely winning."',
  'Man doubles down on 19. Crowd gasps. Man does not elaborate.',
  'Fish casino introduces new game: "Go Fish." Legal team advises against it.',
  'Blackjack dealer revealed to be a sentient halibut. Union dispute pending.',
  'Player goes all-in with 4 billion fish. Gets blackjack. Ocean weeps.',
  'Gambling addiction hotline now accepts fish as payment. Irony noted.',
  '"I had a system," says man with zero fish.',
];


// ── Achievements ───────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  // Fish collected
  { id: 'a_f1',  name: 'First Catch',           icon: '🐟', secret: false, unlocked: false, desc: 'Collect your first fish.',                                    check: () => state.allTimeFish >= 1 },
  { id: 'a_f2',  name: 'Pocket Full of Fish',   icon: '👜', secret: false, unlocked: false, desc: 'Collect 1,000 fish.',                                         check: () => state.allTimeFish >= 1000 },
  { id: 'a_f3',  name: 'Fish Hoarder',          icon: '📦', secret: false, unlocked: false, desc: 'Collect 1,000,000 fish.',                                     check: () => state.allTimeFish >= 1e6 },
  { id: 'a_f4',  name: 'Fish Baron',            icon: '🎩', secret: false, unlocked: false, desc: 'Collect 1 Billion fish.',                                     check: () => state.allTimeFish >= 1e9 },
  { id: 'a_f5',  name: 'Fish Tycoon',           icon: '💰', secret: false, unlocked: false, desc: 'Collect 1 Trillion fish.',                                    check: () => state.allTimeFish >= 1e12 },
  { id: 'a_f6',  name: 'Fish God',              icon: '✨', secret: false, unlocked: false, desc: 'Collect 1 Quadrillion fish.',                                 check: () => state.allTimeFish >= 1e15 },
  { id: 'a_f7',  name: 'The Ocean Itself',      icon: '🌊', secret: false, unlocked: false, desc: 'Collect 1 Quintillion fish.',                                 check: () => state.allTimeFish >= 1e18 },
  // Production speed
  { id: 'a_p1',  name: 'Getting Somewhere',     icon: '⚙️', secret: false, unlocked: false, desc: 'Reach 10 fish/sec.',                                          check: () => state.fishPerSec >= 10 },
  { id: 'a_p2',  name: 'Industrious',           icon: '🏭', secret: false, unlocked: false, desc: 'Reach 1,000 fish/sec.',                                       check: () => state.fishPerSec >= 1000 },
  { id: 'a_p3',  name: 'Fish Factory',          icon: '🔩', secret: false, unlocked: false, desc: 'Reach 1,000,000 fish/sec.',                                   check: () => state.fishPerSec >= 1e6 },
  { id: 'a_p4',  name: 'Unstoppable',           icon: '💥', secret: false, unlocked: false, desc: 'Reach 1 Billion fish/sec.',                                   check: () => state.fishPerSec >= 1e9 },
  // Buildings
  { id: 'a_b1',  name: 'First Rod',             icon: '🎣', secret: false, unlocked: false, desc: 'Buy your first Fishing Rod.',                                 check: () => getBldg('rod').count >= 1 },
  { id: 'a_b2',  name: 'Rod Army',              icon: '🎣', secret: false, unlocked: false, desc: 'Own 50 Fishing Rods.',                                        check: () => getBldg('rod').count >= 50 },
  { id: 'a_b3',  name: 'Go Deeper',             icon: '🤿', secret: false, unlocked: false, desc: 'Buy your first Submarine.',                                   check: () => getBldg('submarine').count >= 1 },
  { id: 'a_b4',  name: 'It Opens',              icon: '🌀', secret: false, unlocked: false, desc: 'Open your first Fish Portal.',                                check: () => getBldg('portal').count >= 1 },
  { id: 'a_b5',  name: 'Hired a God',           icon: '🐙', secret: false, unlocked: false, desc: 'Employ your first Ocean Deity.',                              check: () => getBldg('deity').count >= 1 },
  { id: 'a_b6',  name: 'Kraken Released',       icon: '🦑', secret: false, unlocked: false, desc: 'Acquire your first Kraken.',                                  check: () => getBldg('kraken').count >= 1 },
  { id: 'a_b7',  name: 'Full Fleet',            icon: '🚢', secret: false, unlocked: false, desc: 'Own at least 1 of every building type.',                     check: () => BUILDINGS.every(b => b.count >= 1) },
  { id: 'a_b8',  name: 'Century Club',          icon: '💯', secret: false, unlocked: false, desc: 'Own 100 of any single building.',                             check: () => BUILDINGS.some(b => b.count >= 100) },
  { id: 'a_b9',  name: 'Mass Production',       icon: '🏗️', secret: false, unlocked: false, desc: 'Own 500 buildings total.',                                    check: () => BUILDINGS.reduce((s,b)=>s+b.count,0) >= 500 },
  { id: 'a_b10', name: 'Star Fleet',            icon: '⭐', secret: false, unlocked: false, desc: 'Own your first Fish Star.',                                   check: () => getBldg('fishstar').count >= 1 },
  // Clicks
  { id: 'a_c1',  name: 'Eager Fingers',         icon: '👆', secret: false, unlocked: false, desc: 'Click the fish 100 times.',                                   check: () => state.clickCount >= 100 },
  { id: 'a_c2',  name: 'Dedicated',             icon: '👊', secret: false, unlocked: false, desc: 'Click the fish 1,000 times.',                                 check: () => state.clickCount >= 1000 },
  { id: 'a_c3',  name: 'Carpal Tunnel Incoming',icon: '🖱️', secret: false, unlocked: false, desc: 'Click the fish 10,000 times.',                                check: () => state.clickCount >= 10000 },
  // Upgrades
  { id: 'a_u1',  name: 'Upgrade Curious',       icon: '🔬', secret: false, unlocked: false, desc: 'Buy 5 upgrades.',                                             check: () => UPGRADES.filter(u=>u.bought).length >= 5 },
  { id: 'a_u2',  name: 'Upgrade Enthusiast',    icon: '🧪', secret: false, unlocked: false, desc: 'Buy 20 upgrades.',                                            check: () => UPGRADES.filter(u=>u.bought).length >= 20 },
  { id: 'a_u3',  name: 'Max Potential',         icon: '🏆', secret: false, unlocked: false, desc: 'Buy every single upgrade.',                                   check: () => UPGRADES.every(u=>u.bought) },
  // ── Secret / Easter eggs ──
  { id: 'a_s1',  name: 'Speed Demon',           icon: '⚡', secret: true,  unlocked: false, desc: 'Click 10 times within 1 second. Your finger is a weapon.',   check: () => false }, // triggered in recordClick
  { id: 'a_s2',  name: 'The Answer',            icon: '🔢', secret: true,  unlocked: false, desc: '42. The answer to life, the universe, and fish.',             check: () => BUILDINGS.some(b => b.count === 42) },
  { id: 'a_s3',  name: 'Lonely Fisherman',      icon: '🏝️', secret: true,  unlocked: false, desc: 'Do not click for 3 minutes. The fish came to you.',          check: () => state.allTimeFish > 0 && Date.now() - state.lastClickTime > 180000 },
  { id: 'a_s4',  name: 'Night Owl',             icon: '🦉', secret: true,  unlocked: false, desc: 'Fish between midnight and 4 AM. Everything okay?',           check: () => { const h = new Date().getHours(); return h >= 0 && h < 4; } },
  { id: 'a_s5',  name: 'Totally Broke',         icon: '😭', secret: true,  unlocked: false, desc: 'Spend down to less than 1 fish. Respect.',                   check: () => false }, // triggered after buy
  { id: 'a_s6',  name: 'Overkill',              icon: '💣', secret: true,  unlocked: false, desc: 'Buy 100 buildings in a single click. Subtle.',               check: () => false }, // triggered on buy
  { id: 'a_s7',  name: "It's Over 9000",        icon: '🔥', secret: true,  unlocked: false, desc: 'Reach more than 9,000 fish/sec. WHAT, NINE THOUSAND?!',      check: () => state.fishPerSec > 9000 },
  { id: 'a_s8',  name: 'Portal Addict',         icon: '💫', secret: true,  unlocked: false, desc: 'Own 50 Fish Portals. The fabric of reality is coping.',      check: () => getBldg('portal').count >= 50 },
  { id: 'a_s9',  name: 'Still Waiting...',      icon: '😴', secret: true,  unlocked: false, desc: 'Idle for 10 minutes without clicking.',                      check: () => state.allTimeFish > 0 && Date.now() - state.lastClickTime > 600000 },
  { id: 'a_s10', name: 'Leet',                  icon: '💻', secret: true,  unlocked: false, desc: 'Have exactly 1337 fish at once.',                            check: () => Math.floor(state.fish) === 1337 },
  { id: 'a_s11', name: 'Who Needs Buildings?',  icon: '📊', secret: true,  unlocked: false, desc: 'Reach 500 all-time fish with zero buildings owned.',         check: () => state.allTimeFish >= 500 && BUILDINGS.every(b=>b.count===0) },
  { id: 'a_s12', name: 'Kraken Middle Manager', icon: '📋', secret: true,  unlocked: false, desc: 'Own exactly 25 Krakens.',                                    check: () => getBldg('kraken').count === 25 },
  { id: 'a_s13', name: 'Time Paradox',          icon: '⏰', secret: true,  unlocked: false, desc: 'Own 10 Time Ponds.',                                         check: () => getBldg('timepond').count >= 10 },
  { id: 'a_s14', name: 'Deity Convention',      icon: '🌐', secret: true,  unlocked: false, desc: 'Own 10 Ocean Deities. The paperwork alone is staggering.',   check: () => getBldg('deity').count >= 10 },
  { id: 'a_s15', name: 'Naughty Naughty',      icon: '🤖', secret: true,  unlocked: false, desc: 'An inhuman clicking pattern was detected. We see you.',       check: () => false }, // triggered in recordClick
  { id: 'a_s16', name: 'Hello There',          icon: '👋', secret: true,  unlocked: false, desc: 'You found the secret fish. It was just sitting there, waiting.', check: () => false }, // triggered by title fish click
  { id: 'a_s17', name: 'Stop the Presses',     icon: '📰', secret: true,  unlocked: false, desc: 'You clicked Breaking News. Was it actually breaking?',           check: () => false }, // triggered by news label click
  { id: 'a_s18', name: 'Click Me',             icon: '👆', secret: false, unlocked: false, desc: 'I wonder how to unlock it...',                                  check: () => false }, // triggered by clicking the card
  { id: 'a_s19', name: 'Card Hoarder',         icon: '💀', secret: true,  unlocked: false, desc: 'Lose with more than 4 cards in a single hand. Were you counting on a miracle?',          check: () => false }, // triggered on 5+ card loss
  { id: 'a_s20', name: 'Card Hoarder: Push',  icon: '😐', secret: true,  unlocked: false, desc: "Push with more than 4 cards in a single hand. That's unfortunate.",                                                      check: () => false }, // triggered on 5+ card push
  { id: 'a_s21', name: 'Card Hoarder: Win',   icon: '🤯', secret: true,  unlocked: false, desc: 'Win with more than 4 cards in a single hand. Against all odds. Statistically baffling.',              check: () => false }, // triggered on 5+ card win
  // Gambling
  { id: 'a_g1',  name: 'Feeling Lucky',        icon: '🎰', secret: false, unlocked: false, desc: 'Place your first bet in the Gambling Den.',                   check: () => false }, // triggered
  { id: 'a_g3',  name: 'All In',               icon: '💸', secret: false, unlocked: false, desc: 'Go all-in and win the hand.',                                 check: () => false }, // triggered
  // Blackjack
  { id: 'a_g2',  name: 'Blackjack!',           icon: '🃏', secret: false, unlocked: false, desc: 'Get a natural Blackjack (21 on first two cards).',            check: () => false }, // triggered
  { id: 'a_g4',  name: 'Busted',               icon: '💥', secret: true,  unlocked: false, desc: 'Bust for the first time. It happens to everyone. Once.',      check: () => false }, // triggered
  { id: 'a_g5',  name: 'On a Roll',            icon: '🔥', secret: false, unlocked: false, desc: 'Win 5 Blackjack hands in a row.',                             check: () => false }, // triggered
  { id: 'a_g6',  name: 'Fish Casino',          icon: '🏛️', secret: true,  unlocked: false, desc: 'Win more than 1,000,000 fish in a single Blackjack payout.',  check: () => false }, // triggered in bjFinish
  // Roulette
  { id: 'a_r1',  name: 'Lucky Zero',            icon: '🟢', secret: true,  unlocked: false, desc: 'Bet on green and land on 0. The house weeps.',              check: () => false }, // triggered
  { id: 'a_r3',  name: 'Unlucky Zero',         icon: '😬', secret: true,  unlocked: false, desc: 'Land on 0 without betting on green. So close, yet so far.',   check: () => false }, // triggered
  { id: 'a_r2',  name: 'Red and Black',        icon: '🎡', secret: false, unlocked: false, desc: 'Win 5 roulette spins in a row.',                               check: () => false }, // triggered
];

function getAchievement(id) { return ACHIEVEMENTS.find(a => a.id === id); }

// ── Helpers ────────────────────────────────────────────────────────────────
function getBldg(id) { return BUILDINGS.find(b => b.id === id); }

function buildingCost(b) {
  return Math.ceil(b.baseCost * Math.pow(1.18, b.count));
}

// Total cost to buy `n` buildings starting from b.count
function bulkCost(b, n) {
  if (n <= 0) return 0;
  // sum of geometric series: baseCost * 1.18^count * (1.18^n - 1) / 0.18
  return Math.ceil(b.baseCost * Math.pow(1.18, b.count) * (Math.pow(1.18, n) - 1) / 0.18);
}

// How many of b the player can afford right now
function maxAffordable(b) {
  if (state.fish < buildingCost(b)) return 0;
  // n = floor(log(fish * 0.18 / (baseCost * 1.18^count) + 1) / log(1.18))
  const n = Math.floor(Math.log(state.fish * 0.18 / (b.baseCost * Math.pow(1.18, b.count)) + 1) / Math.log(1.18));
  return Math.max(0, n);
}

// Resolve current buy quantity for building b (returns a number)
function resolvedQty(b) {
  if (state.buyQty === 'max') return maxAffordable(b);
  return state.buyQty;
}

function fmt(n) {
  if (n < 1000) return n.toFixed(n < 10 ? 1 : 0);
  if (n < 1e6)  return (n / 1e3).toFixed(2) + 'K';
  if (n < 1e9)  return (n / 1e6).toFixed(2) + 'M';
  if (n < 1e12) return (n / 1e9).toFixed(2) + 'B';
  return (n / 1e12).toFixed(2) + 'T';
}

// ── Click rate tracking ────────────────────────────────────────────────────
const clickTimestamps = [];
const CLICK_KEEP   = 5;
const CLICK_EXPIRE = 1000;

// Auto-clicker detection: track last 30 intervals
const clickIntervals = [];
const AC_WINDOW = 30; // need 30 consecutive suspicious intervals
let lastClickTs = null;

function recordClick() {
  const now = Date.now();
  clickTimestamps.push(now);
  if (clickTimestamps.length > CLICK_KEEP) clickTimestamps.shift();

  if (lastClickTs !== null) {
    clickIntervals.push(now - lastClickTs);
    if (clickIntervals.length > AC_WINDOW) clickIntervals.shift();

    // Detect auto-clicker: 30 intervals that are impossibly fast AND robotically uniform.
    // mean < 70ms  → >14 cps, essentially impossible to sustain by hand
    // stddev < 8ms → variance so low no human wrist can match it
    if (clickIntervals.length === AC_WINDOW) {
      const mean   = clickIntervals.reduce((a, b) => a + b, 0) / AC_WINDOW;
      const stddev = Math.sqrt(clickIntervals.reduce((s, v) => s + (v - mean) ** 2, 0) / AC_WINDOW);
      if (mean < 70 && stddev < 8) triggerAchievement('a_s15');
    }
  }
  lastClickTs = now;
}

function clickFps() {
  if (!clickTimestamps.length) return 0;
  const now = Date.now();
  // clear buffer after idle timeout so counter reaches 0
  if (now - clickTimestamps[clickTimestamps.length - 1] > CLICK_EXPIRE) {
    clickTimestamps.length = 0;
    return 0;
  }
  // measure from oldest buffered click to NOW, so rate decays naturally as time passes
  const elapsed = (now - clickTimestamps[0]) / 1000;
  if (elapsed <= 0) return 0;
  return (clickTimestamps.length / elapsed) * state.clickPower;
}

// ── FPS calculation ────────────────────────────────────────────────────────
function calcFps() {
  // per-building multipliers
  const bMult = {};
  BUILDINGS.forEach(b => bMult[b.id] = 1);
  let globalMult = 1;

  UPGRADES.filter(u => u.bought).forEach(u => {
    if (u.type === 'building') bMult[u.target] *= u.mult;
    if (u.type === 'global')   globalMult        *= u.mult;
  });

  let total = 0;
  BUILDINGS.forEach(b => {
    total += b.count * b.baseFps * bMult[b.id] * globalMult;
  });
  total += state.rockyCount * 10000;
  state.fishPerSec = total;
}

function effectiveFps(b) {
  let mult = 1;
  UPGRADES.filter(u => u.bought).forEach(u => {
    if (u.type === 'building' && u.target === b.id) mult *= u.mult;
    if (u.type === 'global') mult *= u.mult;
  });
  return b.baseFps * mult;
}

// ── Rocky ──────────────────────────────────────────────────────────────────
function discoverRocky() {
  state.rockyCount++;
  calcFps();
  // update badge
  const display = document.getElementById('rocky-display');
  display.classList.remove('hidden');
  document.getElementById('rocky-count').textContent = state.rockyCount > 1 ? `×${state.rockyCount}` : '';
  document.getElementById('rocky-stat').textContent = `+${(state.rockyCount * 10000).toLocaleString()} fish / sec`;
  // show legendary overlay
  const overlay = document.getElementById('rocky-overlay');
  const closeBtn = document.getElementById('rocky-popup-close');
  overlay.classList.remove('hidden');

  let rockyAfkTimer = setTimeout(() => overlay.classList.add('hidden'), 60000);

  function closeRocky(e) {
    if (e.detail === 0) return; // block keyboard-triggered clicks (Enter/Space)
    clearTimeout(rockyAfkTimer);
    overlay.classList.add('hidden');
    closeBtn.removeEventListener('click', closeRocky);
  }
  closeBtn.addEventListener('click', closeRocky);
}

function calcClickPower() {
  let cp = 1;
  UPGRADES.filter(u => u.bought && u.type === 'click').forEach(u => cp *= u.mult);
  state.clickPower = Math.floor(cp);
}

// ── Gambling Stats ──────────────────────────────────────────────────────────
function renderGambleStats() {
  const el = document.getElementById('gstats-content');
  if (!el) return;
  const bjNet = state.bjWon - state.bjWagered;
  const rlNet = state.rlWon - state.rlWagered;
  const bjWinPct = state.bjHands > 0 ? ((state.bjWins / state.bjHands) * 100).toFixed(1) : '—';
  const rlWinPct = state.rlSpins > 0 ? ((state.rlWins / state.rlSpins) * 100).toFixed(1) : '—';
  const sign = n => n >= 0 ? `+${fmt(n)}` : `−${fmt(Math.abs(n))}`;
  el.innerHTML = `
    <div class="gstats-section">
      <div class="gstats-title">🃏 Blackjack</div>
      <div class="gstats-grid">
        <div class="gstat"><span class="gstat-label">Hands Played</span><span class="gstat-val">${state.bjHands}</span></div>
        <div class="gstat"><span class="gstat-label">Wins</span><span class="gstat-val gstat-win">${state.bjWins}</span></div>
        <div class="gstat"><span class="gstat-label">Losses</span><span class="gstat-val gstat-lose">${state.bjLosses}</span></div>
        <div class="gstat"><span class="gstat-label">Pushes</span><span class="gstat-val">${state.bjPushes}</span></div>
        <div class="gstat"><span class="gstat-label">Blackjacks</span><span class="gstat-val gstat-win">${state.bjBlackjacks}</span></div>
        <div class="gstat"><span class="gstat-label">Win Rate</span><span class="gstat-val">${bjWinPct}${state.bjHands > 0 ? '%' : ''}</span></div>
        <div class="gstat"><span class="gstat-label">Total Wagered</span><span class="gstat-val">🐟 ${fmt(state.bjWagered)}</span></div>
        <div class="gstat"><span class="gstat-label">Net P/L</span><span class="gstat-val ${bjNet >= 0 ? 'gstat-win' : 'gstat-lose'}">🐟 ${sign(bjNet)}</span></div>
        <div class="gstat"><span class="gstat-label">Biggest Win</span><span class="gstat-val gstat-win">🐟 ${fmt(state.bjBiggestWin)}</span></div>
        <div class="gstat"><span class="gstat-label">Best Streak</span><span class="gstat-val">${state.bjBestStreak}</span></div>
      </div>
    </div>
    <div class="gstats-section">
      <div class="gstats-title">🎡 Roulette</div>
      <div class="gstats-grid">
        <div class="gstat"><span class="gstat-label">Spins</span><span class="gstat-val">${state.rlSpins}</span></div>
        <div class="gstat"><span class="gstat-label">Wins</span><span class="gstat-val gstat-win">${state.rlWins}</span></div>
        <div class="gstat"><span class="gstat-label">Losses</span><span class="gstat-val gstat-lose">${state.rlLosses}</span></div>
        <div class="gstat"><span class="gstat-label">Win Rate</span><span class="gstat-val">${rlWinPct}${state.rlSpins > 0 ? '%' : ''}</span></div>
        <div class="gstat"><span class="gstat-label">Total Wagered</span><span class="gstat-val">🐟 ${fmt(state.rlWagered)}</span></div>
        <div class="gstat"><span class="gstat-label">Net P/L</span><span class="gstat-val ${rlNet >= 0 ? 'gstat-win' : 'gstat-lose'}">🐟 ${sign(rlNet)}</span></div>
        <div class="gstat"><span class="gstat-label">Biggest Win</span><span class="gstat-val gstat-win">🐟 ${fmt(state.rlBiggestWin)}</span></div>
        <div class="gstat"><span class="gstat-label">Best Streak</span><span class="gstat-val">${state.rlBestStreak}</span></div>
      </div>
    </div>
    <div class="gstats-section">
      <div class="gstats-title">📊 Combined</div>
      <div class="gstats-grid">
        <div class="gstat"><span class="gstat-label">Total Wagered</span><span class="gstat-val">🐟 ${fmt(state.bjWagered + state.rlWagered)}</span></div>
        <div class="gstat"><span class="gstat-label">Net P/L</span><span class="gstat-val ${(bjNet+rlNet) >= 0 ? 'gstat-win' : 'gstat-lose'}">🐟 ${sign(bjNet + rlNet)}</span></div>
      </div>
    </div>`;
}

// ── Render ─────────────────────────────────────────────────────────────────
function renderStats() {
  document.getElementById('fish-count').textContent = fmt(state.fish) + ' fish';
  const total = state.fishPerSec + clickFps();
  document.getElementById('fish-per-sec').textContent = fmt(total) + ' fish / sec';
  document.getElementById('stat-total').textContent = fmt(state.fish);
  document.getElementById('stat-alltime').textContent = 'all time: ' + fmt(state.allTimeFish);
  document.getElementById('click-val').textContent = fmt(state.clickPower);
}

const MAX_BG_ICONS = 50;

// Simple seeded RNG (mulberry32) so icon positions are stable per building
function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s += 0x6D2B79F5; let t = Math.imul(s ^ s >>> 15, 1 | s); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

function buildIconsBgHtml(b) {
  const n = Math.min(b.count, MAX_BG_ICONS);
  // Use a seed derived from the building id so positions are consistent
  const seed = b.id.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0);
  const rng = makeRng(seed);
  let html = '';
  for (let i = 0; i < n; i++) {
    const left  = (rng() * 100).toFixed(1);        // clamped by CSS
    const top   = (rng() * 100).toFixed(1);        // clamped by CSS
    const rot   = (rng() * 30 - 15).toFixed(1);   // -15..15 deg
    const scale = (0.9 + rng() * 0.2).toFixed(2); // 0.9..1.1×
    html += `<span style="--bx:${left}%;--by:${top}%;transform:rotate(${rot}deg) scale(${scale})">${b.icon}</span>`;
  }
  return html;
}

function renderBuildings() {
  const list = document.getElementById('buildings-list');
  list.innerHTML = '';
  BUILDINGS.forEach(b => {
    const qty = resolvedQty(b);
    const cost = qty > 0 ? bulkCost(b, qty) : buildingCost(b);
    const canAfford = qty > 0 && state.fish >= cost;
    const row = document.createElement('div');
    row.className = 'building-row' + (canAfford ? '' : ' locked');
    row.dataset.id = b.id;
    const label = qty > 1 ? `×${qty} ` : '';
    const buyQtyHtml = qty > 1 ? `<span class="b-buy-qty">+${qty}</span>` : '';
    row.innerHTML = `
      <div class="b-icons-bg">${buildIconsBgHtml(b)}</div>
      <div class="b-icon">${b.icon}</div>
      <div class="b-info">
        <div class="b-name">${b.name}</div>
        <div class="b-desc">${b.desc}</div>
        <div class="b-cost">🐟 ${label}${fmt(cost)} &nbsp;|&nbsp; +${fmt(effectiveFps(b))}/s each${state.fishPerSec > 0 && b.count > 0 ? ` <span class="b-pct">(${(b.count * effectiveFps(b) / state.fishPerSec * 100).toFixed(1)}%)</span>` : ''}</div>
      </div>
      <div class="b-count-wrap">${buyQtyHtml}<span class="b-count">${b.count}</span></div>`;
    list.appendChild(row);
  });
}

// Lightweight update used in the game loop — no DOM rebuild
function updateBuildingAffordability() {
  document.querySelectorAll('.building-row').forEach(row => {
    const b = BUILDINGS.find(b => b.id === row.dataset.id);
    if (!b) return;
    const qty = resolvedQty(b);
    const cost = qty > 0 ? bulkCost(b, qty) : buildingCost(b);
    const canAfford = qty > 0 && state.fish >= cost;
    row.classList.toggle('locked', !canAfford);
    const costEl = row.querySelector('.b-cost');
    if (costEl) {
      const label = qty > 1 ? `×${qty} ` : '';
      costEl.innerHTML = `🐟 ${label}${fmt(cost)} &nbsp;|&nbsp; +${fmt(effectiveFps(b))}/s each${state.fishPerSec > 0 && b.count > 0 ? ` <span class="b-pct">(${(b.count * effectiveFps(b) / state.fishPerSec * 100).toFixed(1)}%)</span>` : ''}`;
    }
    const wrap = row.querySelector('.b-count-wrap');
    if (wrap) {
      const buyQtyEl = wrap.querySelector('.b-buy-qty');
      if (qty > 1) {
        if (buyQtyEl) buyQtyEl.textContent = `+${qty}`;
        else wrap.insertAdjacentHTML('afterbegin', `<span class="b-buy-qty">+${qty}</span>`);
      } else if (buyQtyEl) {
        buyQtyEl.remove();
      }
    }
    const iconsEl = row.querySelector('.b-icons-bg');
    if (iconsEl) {
      const desired = Math.min(b.count, MAX_BG_ICONS);
      if (iconsEl.childElementCount !== desired) iconsEl.innerHTML = buildIconsBgHtml(b);
    }
  });
}

let lastUpgradeSnapshot = '';

function upgradeSnapshot() {
  return UPGRADES.map(u => `${u.id}:${u.req() ? 1 : 0}:${u.bought ? 1 : 0}:${state.fish >= u.cost ? 1 : 0}`).join('|');
}

function renderUpgrades() {
  const list = document.getElementById('upgrades-list');
  list.innerHTML = '';
  UPGRADES.forEach(u => {
    if (!u.req()) return;
    const btn = document.createElement('button');
    btn.className = 'upgrade-btn' + (u.bought ? ' bought' : '');
    btn.disabled = u.bought || state.fish < u.cost;
    btn.dataset.id = u.id;
    btn.innerHTML = `
      <span class="u-name">${u.name}${u.bought ? ' ✓' : ''}</span>
      <span class="u-desc">${u.desc}</span>
      ${u.bought ? '' : `<span class="u-cost">🐟 ${fmt(u.cost)}</span>`}`;
    list.appendChild(btn);
  });
  // listener is set up once at init via initListeners()
}

function maybeRenderUpgrades() {
  const snap = upgradeSnapshot();
  if (snap !== lastUpgradeSnapshot) {
    lastUpgradeSnapshot = snap;
    renderUpgrades();
  }
}

// ── Buy logic ──────────────────────────────────────────────────────────────
function buyBuilding(b) {
  const qty = resolvedQty(b);
  if (qty <= 0) return;
  const cost = bulkCost(b, qty);
  if (state.fish < cost) return;
  state.fish -= cost;
  b.count += qty;
  calcFps();
  renderBuildings();
  renderUpgrades();
  lastUpgradeSnapshot = upgradeSnapshot();
  renderStats();
  // Secret achievement checks
  if (qty >= 100) triggerAchievement('a_s6');        // Overkill
  if (state.fish < 1) triggerAchievement('a_s5');    // Totally Broke
  checkAchievements();
}

function buyUpgrade(u) {
  if (u.bought || state.fish < u.cost) return;
  state.fish -= u.cost;
  u.bought = true;
  if (u.type === 'click') calcClickPower();
  calcFps();
  renderUpgrades();
  lastUpgradeSnapshot = upgradeSnapshot();
  renderStats();
  if (state.fish < 1) triggerAchievement('a_s5');
  checkAchievements();
}

// ── Click handler ──────────────────────────────────────────────────────────
const fishBtn = document.getElementById('fish-btn');
fishBtn.addEventListener('click', () => {
  state.fish += state.clickPower;
  state.allTimeFish += state.clickPower;
  state.clickCount++;
  state.lastClickTime = Date.now();
  recordClick();
  if (Math.random() < 2e-5) discoverRocky();
  // Speed Demon: 10 clicks within 1 second
  if (clickTimestamps.length >= 10) {
    const span = clickTimestamps[clickTimestamps.length - 1] - clickTimestamps[clickTimestamps.length - 10];
    if (span <= 1000) triggerAchievement('a_s1');
  }

  // floating label
  const panel = document.getElementById('clicker-panel');
  const rect  = fishBtn.getBoundingClientRect();
  const pRect = panel.getBoundingClientRect();
  const floater = document.createElement('div');
  floater.className = 'floater';
  floater.textContent = '+' + fmt(state.clickPower);
  floater.style.left = (rect.left - pRect.left + Math.random() * 80 - 20) + 'px';
  floater.style.top  = (rect.top  - pRect.top  + Math.random() * 40)      + 'px';
  panel.appendChild(floater);
  setTimeout(() => floater.remove(), 1000);

  checkMilestones();
  renderStats();
});

// ── Achievement logic ──────────────────────────────────────────────────────
function unlockAchievement(a) {
  if (a.unlocked) return;
  a.unlocked = true;
  showAchievementToast(a);
  renderAchievementsPanel();
}

function showAchievementToast(a) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'ach-toast';
  toast.innerHTML = `<span class="ach-toast-icon">${a.icon}</span><div><div class="ach-toast-title">Achievement Unlocked! — click to view</div><div class="ach-toast-name">${a.name}</div></div>`;
  container.appendChild(toast);

  toast.addEventListener('click', () => {
    document.getElementById('ach-overlay').classList.remove('hidden');
    renderAchievementsPanel();
    // Wait one frame for the grid to be in the DOM, then scroll & highlight
    requestAnimationFrame(() => {
      const card = document.querySelector(`#ach-grid [data-id="${a.id}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('ach-highlight');
        setTimeout(() => card.classList.remove('ach-highlight'), 2000);
      }
    });
  });

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 4000);
}

function checkAchievements() {
  ACHIEVEMENTS.forEach(a => {
    if (!a.unlocked && a.check()) unlockAchievement(a);
  });
}

function triggerAchievement(id) {
  const a = getAchievement(id);
  if (a) unlockAchievement(a);
}

function renderAchievementsPanel() {
  const grid = document.getElementById('ach-grid');
  if (!grid) return;
  const total    = ACHIEVEMENTS.length;
  const unlocked = ACHIEVEMENTS.filter(a => a.unlocked).length;
  document.getElementById('ach-count').textContent = `${unlocked} / ${total}`;
  grid.innerHTML = '';
  const sorted = [...ACHIEVEMENTS].sort((a, b) => {
    const aSecret = a.secret && !a.unlocked;
    const bSecret = b.secret && !b.unlocked;
    if (aSecret === bSecret) return 0;
    return aSecret ? 1 : -1;
  });
  sorted.forEach(a => {
    const card = document.createElement('div');
    const isHidden = a.secret && !a.unlocked;
    card.className = 'ach-card' + (a.unlocked ? ' unlocked' : ' locked') + (isHidden ? ' secret' : '');
    card.dataset.id = a.id;
    card.innerHTML = `
      <div class="ach-card-icon">${isHidden ? '🔒' : a.icon}</div>
      <div class="ach-card-body">
        <div class="ach-card-name">${isHidden ? '???' : a.name}</div>
        <div class="ach-card-desc">${isHidden ? 'Keep playing to discover this secret.' : a.id === 'a_s18' && a.unlocked ? 'Well... you clicked me. Good Job !' : a.desc}</div>
      </div>`;
    if (a.id === 'a_s18' && !a.unlocked) card.style.cursor = 'pointer';
    if (a.id === 'a_s18') card.addEventListener('click', () => triggerAchievement('a_s18'));
    grid.appendChild(card);
  });
}

// ── Milestones ─────────────────────────────────────────────────────────────
const MILESTONES = [
  { at: 10,       msg: '🐟 First catch! The journey begins.' },
  { at: 100,      msg: '🎣 100 fish! You smell like the sea now.' },
  { at: 1000,     msg: '🚣 1,000 fish! Your arms are getting strong.' },
  { at: 10000,    msg: '🛥️ 10,000 fish! Local fishers fear your name.' },
  { at: 100000,   msg: '🌊 100K fish! The ocean is yours.' },
  { at: 1000000,  msg: '🌀 1 MILLION fish! Portal unlocked!' },
  { at: 10000000, msg: '🐙 10M fish! Ancient entities take notice.' },
  { at: 1e9,      msg: '💫 1 BILLION fish! You transcend fishing.' },
];
const shownMilestones = new Set();

function checkMilestones() {
  MILESTONES.forEach(m => {
    if (!shownMilestones.has(m.at) && state.allTimeFish >= m.at) {
      shownMilestones.add(m.at);
      showMilestone(m.msg);
    }
  });
}

function showMilestone(msg) {
  const el = document.getElementById('milestone-ticker');
  el.textContent = msg;
  setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 5000);
}

// ── News ticker ────────────────────────────────────────────────────────────
(function initNews() {
  const el  = document.getElementById('news-text');
  const bar = document.getElementById('news-scroll');
  let idx   = 0;

  function showNext() {
    el.textContent = NEWS_LINES[idx % NEWS_LINES.length];
    idx++;

    // Force a reflow so the browser measures the new text width before animating
    el.style.transition = 'none';
    el.style.transform  = `translateX(${bar.clientWidth}px)`;
    void el.offsetWidth; // reflow

    // Travel = screenWidth + textWidth (so it fully exits left before resetting)
    const travel = bar.clientWidth + el.offsetWidth;
    const speed  = 120; // px per second
    const dur    = travel / speed;

    el.style.transition = `transform ${dur}s linear`;
    el.style.transform  = `translateX(-${el.offsetWidth}px)`;

    // When it finishes scrolling off, show the next line
    el.addEventListener('transitionend', showNext, { once: true });
  }

  showNext();
})();

// ── Blackjack ──────────────────────────────────────────────────────────────
const SUITS = ['♠','♥','♦','♣'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

const BJ = {
  deck: [],
  playerHand: [],
  dealerHand: [],
  splitHand: [],
  bet: 0,
  originalBet: 0,
  splitBet: 0,
  activeHand: 0,       // 0 = main, 1 = split
  state: 'idle',       // idle | playing | done
  consecutiveWins: 0,
  allInBet: false,
  betRaw: null,        // tracks selected bet option key
  handHad5Plus: false, // tracks if active hand reached 5+ cards this round
};

function bjActiveHand() { return BJ.activeHand === 0 ? BJ.playerHand : BJ.splitHand; }

function bjBuildDeck() {
  BJ.deck = [];
  for (let d = 0; d < 6; d++)
    for (const suit of SUITS)
      for (const rank of RANKS)
        BJ.deck.push({ rank, suit, red: suit === '♥' || suit === '♦' });
  for (let i = BJ.deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [BJ.deck[i], BJ.deck[j]] = [BJ.deck[j], BJ.deck[i]];
  }
}

function bjCardVal(rank) {
  if (rank === 'A') return 11;
  if (['J','Q','K'].includes(rank)) return 10;
  return parseInt(rank);
}

function bjScore(hand) {
  let total = 0, aces = 0;
  for (const c of hand) { total += bjCardVal(c.rank); if (c.rank === 'A') aces++; }
  while (total > 21 && aces-- > 0) total -= 10;
  return total;
}

function bjDraw() {
  if (BJ.deck.length < 15) bjBuildDeck();
  return BJ.deck.pop();
}

function bjCardEl(card, faceDown = false) {
  const el = document.createElement('div');
  el.className = 'bj-card' + (card.red ? ' red' : '') + (faceDown ? ' face-down' : '');
  if (faceDown) {
    el.innerHTML = '<span class="bj-card-back">🂠</span>';
  } else {
    el.innerHTML = `<span class="bj-rank">${card.rank}</span><span class="bj-suit">${card.suit}</span>`;
  }
  return el;
}

function bjRender(hideSecondDealer = true) {
  const pEl = document.getElementById('bj-player-cards');
  const dEl = document.getElementById('bj-dealer-cards');
  const splitArea = document.getElementById('bj-split-area');
  pEl.innerHTML = ''; dEl.innerHTML = '';
  BJ.playerHand.forEach(c => pEl.appendChild(bjCardEl(c)));
  BJ.dealerHand.forEach((c, i) => dEl.appendChild(bjCardEl(c, hideSecondDealer && i === 1)));
  document.getElementById('bj-player-score').textContent =
    BJ.playerHand.length ? `(${bjScore(BJ.playerHand)})` : '';
  if (BJ.splitHand.length > 0) {
    splitArea.classList.remove('hidden');
    const sEl = document.getElementById('bj-split-cards');
    sEl.innerHTML = '';
    BJ.splitHand.forEach(c => sEl.appendChild(bjCardEl(c)));
    document.getElementById('bj-split-score').textContent = `(${bjScore(BJ.splitHand)})`;
    document.getElementById('bj-main-hand').classList.toggle('bj-active-hand', BJ.activeHand === 0);
    splitArea.classList.toggle('bj-active-hand', BJ.activeHand === 1);
  } else {
    splitArea.classList.add('hidden');
    document.getElementById('bj-main-hand').classList.remove('bj-active-hand');
  }
  if (hideSecondDealer && BJ.dealerHand.length) {
    document.getElementById('bj-dealer-score').textContent = `(${bjCardVal(BJ.dealerHand[0].rank)})`;
  } else {
    document.getElementById('bj-dealer-score').textContent =
      BJ.dealerHand.length ? `(${bjScore(BJ.dealerHand)})` : '';
  }
}

function bjMsg(text, type = '') {
  const el = document.getElementById('bj-message');
  el.textContent = text;
  el.className = type ? `bj-msg-${type}` : '';
}

function bjSetPlaying(active) {
  document.getElementById('bj-deal').disabled   = active;
  document.getElementById('bj-hit').disabled    = !active;
  document.getElementById('bj-stand').disabled  = !active;
  document.getElementById('bj-double').disabled = !active;
  document.getElementById('bj-split').disabled  = true; // managed separately
  document.querySelectorAll('.bj-bet-btn').forEach(b => b.disabled = active);
}

function bjDeal() {
  if (BJ.bet <= 0)          { bjMsg('Set a bet first!', 'warn'); return; }
  if (state.fish < BJ.bet)  { bjMsg('Not enough fish!', 'warn'); return; }
  triggerAchievement('a_g1');
  BJ.originalBet = BJ.bet;
  state.fish -= BJ.bet;
  renderStats();
  if (BJ.deck.length < 15) bjBuildDeck();
  BJ.playerHand = [bjDraw(), bjDraw()];
  BJ.dealerHand = [bjDraw(), bjDraw()];
  BJ.splitHand = [];
  BJ.splitBet = 0;
  BJ.activeHand = 0;
  BJ.handHad5Plus = false;
  BJ.state = 'playing';
  bjRender(true);
  bjSetPlaying(true);
  bjMsg('');
  document.getElementById('bj-double').disabled = state.fish < BJ.bet;
  const canSplit = bjCardVal(BJ.playerHand[0].rank) === bjCardVal(BJ.playerHand[1].rank) && state.fish >= BJ.bet;
  document.getElementById('bj-split').disabled = !canSplit;
  if (bjScore(BJ.playerHand) === 21) bjFinish('blackjack');
}

function bjHit() {
  bjActiveHand().push(bjDraw());
  bjRender(true);
  document.getElementById('bj-double').disabled = true;
  document.getElementById('bj-split').disabled = true;
  if (bjActiveHand().length > 4) BJ.handHad5Plus = true;
  const s = bjScore(bjActiveHand());
  if (s > 21 || s === 21) bjAdvance();
}

function bjStand() { bjAdvance(); }

function bjDouble() {
  const currentBet = BJ.activeHand === 0 ? BJ.bet : BJ.splitBet;
  if (state.fish < currentBet) { bjMsg('Not enough fish to double!', 'warn'); return; }
  state.fish -= currentBet;
  if (BJ.activeHand === 0) {
    BJ.bet *= 2;
    document.getElementById('bj-current-bet').textContent = `Bet: ${fmt(BJ.bet)} 🐟`;
  } else {
    BJ.splitBet *= 2;
  }
  renderStats();
  bjActiveHand().push(bjDraw());
  bjRender(true);
  bjAdvance();
}

function bjSplit() {
  if (state.fish < BJ.originalBet) { bjMsg('Not enough fish to split!', 'warn'); return; }
  state.fish -= BJ.originalBet;
  BJ.splitBet = BJ.originalBet;
  BJ.splitHand = [BJ.playerHand.pop()];
  BJ.playerHand.push(bjDraw());
  BJ.splitHand.push(bjDraw());
  BJ.activeHand = 0;
  renderStats();
  bjRender(true);
  document.getElementById('bj-split').disabled = true;
  document.getElementById('bj-double').disabled = state.fish < BJ.bet;
  bjMsg('Split! Play your left hand first.');
  if (bjScore(BJ.playerHand) === 21) bjAdvance();
}

async function bjAdvance() {
  // If on main hand and split exists, switch to split hand
  if (BJ.splitHand.length > 0 && BJ.activeHand === 0) {
    BJ.activeHand = 1;
    bjRender(true);
    document.getElementById('bj-double').disabled = state.fish < BJ.splitBet;
    bjMsg('Now play your right hand.');
    if (bjScore(BJ.splitHand) === 21) bjAdvance();
    return;
  }
  // Dealer's turn
  bjRender(false);
  bjSetPlaying(false);
  BJ.state = 'dealer';
  while (bjScore(BJ.dealerHand) < 17) {
    await new Promise(r => setTimeout(r, 480));
    BJ.dealerHand.push(bjDraw());
    bjRender(false);
  }
  const d = bjScore(BJ.dealerHand);
  if (BJ.splitHand.length > 0) {
    bjFinishSplit(d);
  } else {
    const p = bjScore(BJ.playerHand);
    if (p > 21)             bjFinish('bust');
    else if (d > 21 || p > d) bjFinish('win');
    else if (p === d)       bjFinish('push');
    else                    bjFinish('lose');
  }
}

function bjFinishSplit(dealerScore) {
  BJ.state = 'done';
  bjRender(false);
  let totalPayout = 0;
  const msgs = [];

  function resolveHand(hand, bet, label) {
    const s = bjScore(hand);
    if (s > 21) {
      msgs.push(`${label}: Bust 💥`); return 0;
    } else if (dealerScore > 21 || s > dealerScore) {
      msgs.push(`${label}: Win +${fmt(bet)} 🎉`); return bet * 2;
    } else if (s === dealerScore) {
      msgs.push(`${label}: Push 🤝`); return bet;
    } else {
      msgs.push(`${label}: Lose 😔`); return 0;
    }
  }

  totalPayout += resolveHand(BJ.playerHand, BJ.bet, 'Left');
  totalPayout += resolveHand(BJ.splitHand, BJ.splitBet, 'Right');
  state.fish += totalPayout;
  renderStats();
  const totalBet = BJ.bet + BJ.splitBet;
  bjMsg(msgs.join(' | '), totalPayout > totalBet ? 'win' : totalPayout === 0 ? 'lose' : '');
  if (totalPayout >= 1000000) triggerAchievement('a_g6');
  // Gambling stats for split
  state.bjHands += 2;
  state.bjWagered += totalBet;
  state.bjWon += totalPayout;
  [[BJ.playerHand], [BJ.splitHand]].forEach(([hand]) => {
    const s = bjScore(hand);
    if (s > 21) state.bjLosses++;
    else if (dealerScore > 21 || s > dealerScore) state.bjWins++;
    else if (s === dealerScore) state.bjPushes++;
    else state.bjLosses++;
  });
  const splitNet = totalPayout - totalBet;
  if (splitNet > state.bjBiggestWin) state.bjBiggestWin = splitNet;
  if (BJ.consecutiveWins > state.bjBestStreak) state.bjBestStreak = BJ.consecutiveWins;
  [[BJ.playerHand], [BJ.splitHand]].forEach(([hand]) => {
    if (hand.length <= 4) return;
    const s = bjScore(hand);
    if (s > 21)                                  triggerAchievement('a_s19');
    else if (dealerScore > 21 || s > dealerScore) triggerAchievement('a_s21');
    else if (s === dealerScore)                   triggerAchievement('a_s20');
    else                                          triggerAchievement('a_s19');
  });
  BJ.splitHand = [];
  BJ.splitBet = 0;
  BJ.activeHand = 0;
  BJ.allInBet = false;
  if (BJ.betRaw) bjSetBet(BJ.betRaw); else { BJ.bet = BJ.originalBet; document.getElementById('bj-current-bet').textContent = `Bet: ${fmt(BJ.bet)} 🐟`; }
  bjSetPlaying(false);
  bjRender(false);
  checkAchievements();
}

function bjFinish(result) {
  BJ.state = 'done';
  bjRender(false);
  bjSetPlaying(false);
  let payout = 0;
  if (result === 'blackjack') {
    payout = Math.floor(BJ.bet * 2.5);
    bjMsg(`🃏 Blackjack! You win ${fmt(payout)} 🐟`, 'win');
    triggerAchievement('a_g2');
  } else if (result === 'win') {
    payout = BJ.bet * 2;
    bjMsg(`🎉 You win ${fmt(payout)} 🐟!`, 'win');
  } else if (result === 'push') {
    payout = BJ.bet;
    bjMsg('🤝 Push — bet returned.', 'push');
  } else if (result === 'bust') {
    bjMsg(`💥 Bust! You lose ${fmt(BJ.bet)} 🐟.`, 'lose');
  } else {
    bjMsg(`😔 Dealer wins. You lose ${fmt(BJ.bet)} 🐟.`, 'lose');
  }
  if (payout > 0) {
    state.fish += payout;
    renderStats();
    if (payout >= 1000000) triggerAchievement('a_g6');
  }
  // streak tracking
  if (result === 'win' || result === 'blackjack') {
    BJ.consecutiveWins++;
    if (BJ.consecutiveWins >= 5) triggerAchievement('a_g5');
    if (BJ.allInBet) triggerAchievement('a_g3');
  } else if (result !== 'push') {
    BJ.consecutiveWins = 0;
  }
  if (result === 'bust') triggerAchievement('a_g4');
  // Gambling stats
  state.bjHands++;
  state.bjWagered += BJ.bet;
  state.bjWon += payout;
  if (result === 'blackjack') { state.bjWins++; state.bjBlackjacks++; }
  else if (result === 'win')  { state.bjWins++; }
  else if (result === 'push') { state.bjPushes++; }
  else                        { state.bjLosses++; }
  const bjNet = payout - BJ.bet;
  if (bjNet > state.bjBiggestWin) state.bjBiggestWin = bjNet;
  if (BJ.consecutiveWins > state.bjBestStreak) state.bjBestStreak = BJ.consecutiveWins;
  if (BJ.handHad5Plus) {
    if (result === 'win' || result === 'blackjack') triggerAchievement('a_s21');
    else if (result === 'push')                     triggerAchievement('a_s20');
    else                                            triggerAchievement('a_s19');
  }
  BJ.allInBet = false;
  if (BJ.betRaw) bjSetBet(BJ.betRaw); else { BJ.bet = BJ.originalBet; document.getElementById('bj-current-bet').textContent = `Bet: ${fmt(BJ.bet)} 🐟`; }
  checkAchievements();
}

function bjSetBet(raw) {
  let amount;
  if (raw === 'allin') {
    amount = Math.floor(state.fish);
    BJ.allInBet = true;
  } else {
    amount = parseInt(raw);
    BJ.allInBet = false;
  }
  if (amount <= 0) { bjMsg('You have no fish to bet!', 'warn'); return; }
  BJ.betRaw = raw;
  BJ.bet = amount;
  document.getElementById('bj-current-bet').textContent = `Bet: ${fmt(BJ.bet)} 🐟`;
  document.querySelectorAll('.bj-bet-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.bet === raw));
}

bjBuildDeck();

// ── Roulette ───────────────────────────────────────────────────────────────
const RL_RED   = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const RL_ORDER = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];

const RL_INIT_ROT = -(360 / 37) / 2;   // aligns pointer to center of segment 0 (green)
const RL = { bet: 0, betRaw: null, betType: 'red', spinning: false, consecutiveWins: 0, currentRotation: RL_INIT_ROT };

function rlNumberColor(n) {
  if (n === 0) return 'green';
  return RL_RED.has(n) ? 'red' : 'black';
}

function rlHighlightNums(betType) {
  const all = Array.from({length: 36}, (_, i) => i + 1);
  switch (betType) {
    case 'zero':   return new Set([0]);
    case 'red':    return new Set(all.filter(n => RL_RED.has(n)));
    case 'black':  return new Set(all.filter(n => !RL_RED.has(n)));
    case 'odd':    return new Set(all.filter(n => n % 2 === 1));
    case 'even':   return new Set(all.filter(n => n % 2 === 0));
    case 'low':    return new Set(all.filter(n => n <= 18));
    case 'high':   return new Set(all.filter(n => n >= 19));
    case 'dozen1': return new Set(all.filter(n => n <= 12));
    case 'dozen2': return new Set(all.filter(n => n >= 13 && n <= 24));
    case 'dozen3': return new Set(all.filter(n => n >= 25));
    default:       return new Set();
  }
}

let rlPulseRAF = null;

function rlDrawWheel(highlighted = new Set(), pulse = 1) {
  const canvas = document.getElementById('rl-canvas');
  const ctx    = canvas.getContext('2d');
  const size   = canvas.width;
  const cx = size / 2, cy = size / 2;
  const outerR = size / 2;
  const numR   = outerR * 0.76;
  const seg    = (Math.PI * 2) / 37;

  ctx.clearRect(0, 0, size, size);

  RL_ORDER.forEach((n, i) => {
    const startAngle = i * seg - Math.PI / 2;
    const endAngle   = startAngle + seg;
    const color = rlNumberColor(n);
    const lit   = highlighted.has(n);
    let fill;
    if (!lit) {
      fill = color === 'green' ? '#1a7a1a' : color === 'red' ? '#9a1010' : '#151515';
    } else {
      // interpolate between dim and bright using pulse (0..1)
      if (color === 'green') fill = `rgb(${Math.round(26 + 229*pulse)},${Math.round(122 + 110*pulse)},${Math.round(26)})`;
      else if (color === 'red') fill = `rgb(${Math.round(154 + 101*pulse)},${Math.round(16 + 239*pulse)},${Math.round(16 + 239*pulse)})`;
      else fill = `rgb(${Math.round(21 + 234*pulse)},${Math.round(21 + 234*pulse)},${Math.round(21 + 234*pulse)})`;
    }

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = '#3a0a5a';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    const midAngle = startAngle + seg / 2;
    const tx = cx + Math.cos(midAngle) * numR;
    const ty = cy + Math.sin(midAngle) * numR;
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(midAngle + Math.PI / 2);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.toString(), 0, 0);
    ctx.restore();
  });

  canvas.style.transform = `rotate(${RL.currentRotation}deg)`;
}

function rlStartPulse() {
  if (rlPulseRAF) cancelAnimationFrame(rlPulseRAF);
  const highlighted = rlHighlightNums(RL.betType);
  function frame() {
    if (RL.spinning) return; // pause during spin
    const raw = (Math.sin(Date.now() / 650) + 1) / 2;   // faster cycle
    const pulse = Math.pow(raw, 6);                       // sharp spike — dim most of the time, quick bright flash
    rlDrawWheel(highlighted, pulse);
    rlPulseRAF = requestAnimationFrame(frame);
  }
  rlPulseRAF = requestAnimationFrame(frame);
}

function rlInit() {
  rlStartPulse();
}

function rlMsg(text, type) {
  const el = document.getElementById('rl-message');
  el.textContent = text;
  el.className = type ? `bj-msg-${type}` : '';
}

function updateBetButtons() {
  const fish = state.fish;
  const PCTS = [0.001, 0.01, 0.05, 0.10, 0.25];
  const MINS = [10, 100, 1000, 10000, 100000];
  const niceRound = n => { if (n < 10) return n; const m = Math.pow(10, Math.floor(Math.log10(n)) - 1); return Math.round(n / m) * m; };
  const amounts = PCTS.map((p, i) => niceRound(Math.max(MINS[i], Math.floor(fish * p))));

  [...document.querySelectorAll('.bj-bet-btn')].filter(b => b.dataset.bet !== 'allin')
    .forEach((btn, i) => { btn.dataset.bet = amounts[i]; btn.textContent = fmt(amounts[i]); });

  [...document.querySelectorAll('.rl-amount-btn')].filter(b => b.dataset.bet !== 'allin')
    .forEach((btn, i) => { btn.dataset.bet = amounts[i]; btn.textContent = fmt(amounts[i]); });
}

function rlSetBet(raw) {
  const amount = raw === 'allin' ? Math.floor(state.fish) : parseInt(raw);
  if (amount <= 0) { rlMsg('You have no fish to bet!', 'warn'); return; }
  RL.betRaw = raw;
  RL.bet = amount;
  document.getElementById('rl-current-bet').textContent = `Bet: ${fmt(RL.bet)} 🐟`;
  document.querySelectorAll('.rl-amount-btn').forEach(b => b.classList.toggle('active', b.dataset.bet === raw));
}

function rlCalcPayout(result, betType, bet) {
  const color = rlNumberColor(result);
  const isOdd = result > 0 && result % 2 !== 0;
  let mult = 0;
  switch (betType) {
    case 'zero':   if (result === 0)                           mult = 36; break;
    case 'red':    if (color === 'red')                        mult = 2; break;
    case 'black':  if (color === 'black')                     mult = 2; break;
    case 'odd':    if (isOdd)                                 mult = 2; break;
    case 'even':   if (result > 0 && !isOdd)                 mult = 2; break;
    case 'low':    if (result >= 1  && result <= 18)          mult = 2; break;
    case 'high':   if (result >= 19 && result <= 36)          mult = 2; break;
    case 'dozen1': if (result >= 1  && result <= 12)          mult = 3; break;
    case 'dozen2': if (result >= 13 && result <= 24)          mult = 3; break;
    case 'dozen3': if (result >= 25 && result <= 36)          mult = 3; break;
  }
  return mult > 0 ? bet * mult : 0;
}

async function rlSpin() {
  if (RL.spinning) return;
  if (RL.bet <= 0)         { rlMsg('Set a bet first!', 'warn'); return; }
  if (state.fish < RL.bet) { rlMsg('Not enough fish!', 'warn'); return; }

  RL.spinning = true;
  if (rlPulseRAF) { cancelAnimationFrame(rlPulseRAF); rlPulseRAF = null; }
  rlDrawWheel(new Set(), 0); // reset all segments to normal colors before spin
  document.getElementById('rl-spin').disabled = true;
  state.fish -= RL.bet;
  renderStats();

  const result    = Math.floor(Math.random() * 37);
  const resultEl  = document.getElementById('rl-result-num');
  const wheelEl   = document.getElementById('rl-canvas');

  resultEl.textContent = '?';
  resultEl.style.color = '#fff';

  const seg           = 360 / 37;
  const idx           = RL_ORDER.indexOf(result);
  const segCenter     = idx * seg + seg / 2;
  const targetAngle   = 360 - segCenter;   // angle that puts this segment at the pointer
  const normalized    = ((RL.currentRotation % 360) + 360) % 360;
  let   delta         = targetAngle - normalized;
  if (delta < 0) delta += 360;
  const totalRot      = RL.currentRotation + 5 * 360 + delta;

  wheelEl.style.transition = 'transform 4s cubic-bezier(0.17,0.67,0.12,0.99)';
  wheelEl.style.transform  = `rotate(${totalRot}deg)`;

  await new Promise(r => setTimeout(r, 4200));

  const color = rlNumberColor(result);
  resultEl.textContent = result;
  resultEl.style.color = color === 'red' ? '#ff7070' : color === 'green' ? '#60ff90' : '#c0c0c0';

  const payout = rlCalcPayout(result, RL.betType, RL.bet);
  if (payout > 0) {
    state.fish += payout;
    RL.consecutiveWins++;
    rlMsg(`${result} — ${color.toUpperCase()}! You win ${fmt(payout)} 🐟`, 'win');
    if (RL.consecutiveWins >= 5) triggerAchievement('a_r2');
  } else {
    RL.consecutiveWins = 0;
    rlMsg(`${result} — ${color.toUpperCase()}. You lose ${fmt(RL.bet)} 🐟.`, 'lose');
  }
  if (result === 0 && payout > 0)  triggerAchievement('a_r1');
  if (result === 0 && payout === 0) triggerAchievement('a_r3');
  // Gambling stats
  state.rlSpins++;
  state.rlWagered += RL.bet;
  state.rlWon += payout;
  if (payout > 0) {
    state.rlWins++;
    const rlNet = payout - RL.bet;
    if (rlNet > state.rlBiggestWin) state.rlBiggestWin = rlNet;
    if (RL.consecutiveWins > state.rlBestStreak) state.rlBestStreak = RL.consecutiveWins;
  } else {
    state.rlLosses++;
  }

  RL.currentRotation = totalRot;
  wheelEl.style.transition = '';
  rlStartPulse();
  renderStats();
  checkAchievements();

  RL.spinning = false;
  document.getElementById('rl-spin').disabled = false;
  if (RL.betRaw) rlSetBet(RL.betRaw);
}

// ── Game loop ──────────────────────────────────────────────────────────────
let lastTime = null;
let renderAccum = 0;

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  const gained = state.fishPerSec * dt;
  state.fish += gained;
  state.allTimeFish += gained;

  renderAccum += dt;
  if (renderAccum >= 0.1) {
    renderAccum = 0;
    renderStats();
    updateBuildingAffordability();
    maybeRenderUpgrades();
    checkMilestones();
    checkAchievements();
  }

  requestAnimationFrame(gameLoop);
}

// ── Save / Load ────────────────────────────────────────────────────────────
function saveGame() {
  localStorage.setItem('fishclicker_save', JSON.stringify(getSaveData()));
}

function loadGame() {
  try {
    const raw = localStorage.getItem('fishclicker_save');
    if (!raw) return;
    const data = JSON.parse(raw);
    state.fish = data.fish || 0;
    state.allTimeFish = data.allTimeFish || 0;
    state.clickCount = data.clickCount || 0;
    data.buildings.forEach(s => {
      const b = getBldg(s.id);
      if (b) b.count = s.count;
    });
    data.upgrades.forEach(uid => {
      const u = UPGRADES.find(u => u.id === uid);
      if (u) u.bought = true;
    });
    (data.achievements || []).forEach(aid => {
      const a = getAchievement(aid);
      if (a) a.unlocked = true;
    });
    state.bjHands      = data.bjHands      || 0;
    state.bjWins       = data.bjWins       || 0;
    state.bjLosses     = data.bjLosses     || 0;
    state.bjPushes     = data.bjPushes     || 0;
    state.bjBlackjacks = data.bjBlackjacks || 0;
    state.bjWagered    = data.bjWagered    || 0;
    state.bjWon        = data.bjWon        || 0;
    state.bjBiggestWin = data.bjBiggestWin || 0;
    state.bjBestStreak = data.bjBestStreak || 0;
    state.rlSpins      = data.rlSpins      || 0;
    state.rlWins       = data.rlWins       || 0;
    state.rlLosses     = data.rlLosses     || 0;
    state.rlWagered    = data.rlWagered    || 0;
    state.rlWon        = data.rlWon        || 0;
    state.rlBiggestWin = data.rlBiggestWin || 0;
    state.rlBestStreak = data.rlBestStreak || 0;
    if (data.rockyCount) {
      state.rockyCount = data.rockyCount;
      const display = document.getElementById('rocky-display');
      display.classList.remove('hidden');
      document.getElementById('rocky-count').textContent = state.rockyCount > 1 ? `×${state.rockyCount}` : '';
      document.getElementById('rocky-stat').textContent = `+${(state.rockyCount * 10000).toLocaleString()} fish / sec`;
    }
    calcFps();
    calcClickPower();
  } catch (e) { /* ignore corrupt save */ }
}

function getSaveData() {
  return {
    fish: state.fish,
    allTimeFish: state.allTimeFish,
    clickCount: state.clickCount,
    buildings: BUILDINGS.map(b => ({ id: b.id, count: b.count })),
    upgrades: UPGRADES.filter(u => u.bought).map(u => u.id),
    achievements: ACHIEVEMENTS.filter(a => a.unlocked).map(a => a.id),
    rockyCount: state.rockyCount,
    bjHands: state.bjHands, bjWins: state.bjWins, bjLosses: state.bjLosses,
    bjPushes: state.bjPushes, bjBlackjacks: state.bjBlackjacks,
    bjWagered: state.bjWagered, bjWon: state.bjWon,
    bjBiggestWin: state.bjBiggestWin, bjBestStreak: state.bjBestStreak,
    rlSpins: state.rlSpins, rlWins: state.rlWins, rlLosses: state.rlLosses,
    rlWagered: state.rlWagered, rlWon: state.rlWon,
    rlBiggestWin: state.rlBiggestWin, rlBestStreak: state.rlBestStreak,
  };
}

function exportSave() {
  return btoa(JSON.stringify(getSaveData()));
}

function importSave(str) {
  try {
    const data = JSON.parse(atob(str.trim()));
    state.fish = data.fish || 0;
    state.allTimeFish = data.allTimeFish || 0;
    state.clickCount = data.clickCount || 0;
    BUILDINGS.forEach(b => b.count = 0);
    (data.buildings || []).forEach(s => {
      const b = getBldg(s.id);
      if (b) b.count = s.count;
    });
    UPGRADES.forEach(u => u.bought = false);
    (data.upgrades || []).forEach(uid => {
      const u = UPGRADES.find(u => u.id === uid);
      if (u) u.bought = true;
    });
    ACHIEVEMENTS.forEach(a => a.unlocked = false);
    (data.achievements || []).forEach(aid => {
      const a = getAchievement(aid);
      if (a) a.unlocked = true;
    });
    state.rockyCount = data.rockyCount || 0;
    if (state.rockyCount > 0) {
      document.getElementById('rocky-display').classList.remove('hidden');
      document.getElementById('rocky-count').textContent = state.rockyCount > 1 ? `×${state.rockyCount}` : '';
      document.getElementById('rocky-stat').textContent = `+${(state.rockyCount * 10000).toLocaleString()} fish / sec`;
    } else {
      document.getElementById('rocky-display').classList.add('hidden');
    }
    calcFps();
    calcClickPower();
    saveGame();
    renderStats();
    renderBuildings();
    renderUpgrades();
    lastUpgradeSnapshot = upgradeSnapshot();
    renderAchievementsPanel();
    return true;
  } catch (e) {
    return false;
  }
}

function showSaveMsg(text, type) {
  const el = document.getElementById('save-msg');
  el.textContent = text;
  el.className = 'save-msg-' + type;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.textContent = ''; el.className = ''; }, 3000);
}

// ── Init ───────────────────────────────────────────────────────────────────
function initListeners() {
  // Buildings — one permanent delegated listener
  document.getElementById('buildings-list').addEventListener('click', e => {
    const row = e.target.closest('.building-row');
    if (!row || row.classList.contains('locked')) return;
    const b = BUILDINGS.find(b => b.id === row.dataset.id);
    if (b) buyBuilding(b);
  });

  // Upgrades — one permanent delegated listener
  document.getElementById('upgrades-list').addEventListener('click', e => {
    const btn = e.target.closest('.upgrade-btn');
    if (!btn || btn.disabled) return;
    const u = UPGRADES.find(u => u.id === btn.dataset.id);
    if (u) buyUpgrade(u);
  });

  // Secret title fish
  document.getElementById('title-fish').addEventListener('click', () => {
    triggerAchievement('a_s16');
  });

  // Secret breaking news
  document.getElementById('news-label').addEventListener('click', () => {
    triggerAchievement('a_s17');
  });

  // Achievements panel open/close
  document.getElementById('ach-btn').addEventListener('click', () => {
    document.getElementById('ach-overlay').classList.toggle('hidden');
    renderAchievementsPanel();
  });
  document.getElementById('ach-close').addEventListener('click', () => {
    document.getElementById('ach-overlay').classList.add('hidden');
  });
  document.getElementById('ach-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('ach-overlay'))
      document.getElementById('ach-overlay').classList.add('hidden');
  });

  // Gambling Den open/close
  document.getElementById('gamble-btn').addEventListener('click', () => {
    updateBetButtons();
    document.getElementById('gamble-overlay').classList.toggle('hidden');
  });
  document.getElementById('gamble-close').addEventListener('click', () => {
    document.getElementById('gamble-overlay').classList.add('hidden');
  });
  document.getElementById('gamble-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('gamble-overlay'))
      document.getElementById('gamble-overlay').classList.add('hidden');
  });

  // Gamble tabs
  document.getElementById('gamble-tabs').addEventListener('click', e => {
    const tab = e.target.closest('.gamble-tab');
    if (!tab) return;
    document.querySelectorAll('.gamble-tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.gamble-game').forEach(g => g.classList.toggle('hidden', g.id !== tab.dataset.tab));
    if (tab.dataset.tab === 'gamble-stats') renderGambleStats();
  });

  // Blackjack bet buttons
  document.getElementById('gamble-panel').addEventListener('click', e => {
    const bb = e.target.closest('.bj-bet-btn');
    if (bb && !bb.disabled) { bjSetBet(bb.dataset.bet); return; }
  });
  document.getElementById('bj-deal').addEventListener('click', bjDeal);
  document.getElementById('bj-hit').addEventListener('click', bjHit);
  document.getElementById('bj-stand').addEventListener('click', bjStand);
  document.getElementById('bj-double').addEventListener('click', bjDouble);
  document.getElementById('bj-split').addEventListener('click', bjSplit);

  // Save panel open/close
  document.getElementById('save-btn').addEventListener('click', () => {
    document.getElementById('save-overlay').classList.toggle('hidden');
    document.getElementById('save-export-text').value = exportSave();
    document.getElementById('save-import-text').value = '';
    document.getElementById('save-msg').textContent = '';
  });
  document.getElementById('save-close').addEventListener('click', () => {
    document.getElementById('save-overlay').classList.add('hidden');
  });
  document.getElementById('save-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('save-overlay'))
      document.getElementById('save-overlay').classList.add('hidden');
  });

  // Copy to clipboard
  document.getElementById('save-copy-btn').addEventListener('click', () => {
    const txt = document.getElementById('save-export-text').value;
    navigator.clipboard.writeText(txt).then(() => {
      showSaveMsg('Copied to clipboard!', 'ok');
    }).catch(() => {
      document.getElementById('save-export-text').select();
      showSaveMsg('Press Ctrl+C to copy.', 'ok');
    });
  });

  // Save to browser now
  document.getElementById('save-now-btn').addEventListener('click', () => {
    saveGame();
    showSaveMsg('Saved to browser!', 'ok');
  });

  // Load from string
  document.getElementById('save-load-btn').addEventListener('click', () => {
    const str = document.getElementById('save-import-text').value.trim();
    if (!str) { showSaveMsg('Paste a save string first.', 'err'); return; }
    if (importSave(str)) {
      document.getElementById('save-export-text').value = exportSave();
      document.getElementById('save-import-text').value = '';
      showSaveMsg('Save loaded!', 'ok');
    } else {
      showSaveMsg('Invalid save string.', 'err');
    }
  });

  // Wipe save
  document.getElementById('save-wipe-btn').addEventListener('click', () => {
    if (!confirm('Wipe all progress? This cannot be undone.')) return;
    localStorage.removeItem('fishclicker_save');
    location.reload();
  });

  // Roulette
  document.getElementById('roulette').addEventListener('click', e => {
    const ab = e.target.closest('.rl-amount-btn');
    if (ab) { rlSetBet(ab.dataset.bet); return; }
    const tb = e.target.closest('.rl-type-btn');
    if (tb) {
      RL.betType = tb.dataset.type;
      document.querySelectorAll('.rl-type-btn').forEach(b => b.classList.toggle('active', b === tb));
      rlStartPulse();
    }
  });
  document.getElementById('rl-spin').addEventListener('click', rlSpin);

  // Quantity bar
  document.getElementById('qty-bar').addEventListener('click', e => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    const raw = btn.dataset.qty;
    state.buyQty = raw === 'max' ? 'max' : parseInt(raw, 10);
    document.querySelectorAll('.qty-btn').forEach(b => b.classList.toggle('active', b === btn));
    renderBuildings(); // rebuild to show updated costs
  });
}

loadGame();
rlInit();
renderStats();
renderBuildings();
renderUpgrades();
lastUpgradeSnapshot = upgradeSnapshot();
renderAchievementsPanel();
initListeners();
requestAnimationFrame(gameLoop);
setInterval(saveGame, 10000); // auto-save every 10s
