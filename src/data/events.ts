import {
  CyclingEvent,
  EventCategory,
  SouthAfricanProvince,
} from '../types';

export const OFFICIAL_BICYCLE_LOGISTICS_URL = 'https://www.bicyclelogistics.co.za/';
export const BICYCLE_LOGISTICS_ENQUIRY_URL = 'https://www.bicyclelogistics.co.za/';

export const EVENT_CATEGORIES: EventCategory[] = [
  'All Events',
  'Road Cycling',
  'Mountain Biking',
  'Gravel',
  'Ultra Cycling',
  'Triathlon',
];

export const SA_PROVINCES: SouthAfricanProvince[] = [
  'All Locations',
  'Western Cape',
  'Gauteng',
  'KwaZulu-Natal',
  'Eastern Cape',
];

export const CYCLING_EVENTS: CyclingEvent[] = [
  {
    id: 'cape-town-cycle-tour',
    name: 'Cape Town Cycle Tour',
    tagline: 'The world’s largest timed cycle race around the iconic Cape Peninsula',
    location: 'Cape Town, Western Cape',
    province: 'Western Cape',
    dateDisplay: 'Sample Date: Mar 2027 Window (TBC)',
    sortDate: '2027-03-08',
    isSampleDate: true,
    category: 'Road Cycling',
    featured: true,
    shortDescription:
      'An iconic 109 km coastal road classic circumnavigating the Cape Peninsula from Grand Parade to Green Point via Chapman’s Peak and Suikerbossie.',
    description:
      'The Cape Town Cycle Tour is South Africa’s flagship road cycling celebration, drawing up to 30,000 local and international riders. Starting at the foot of Table Mountain near the Castle of Good Hope, the flagship 109 km route traces the dramatic Atlantic and False Bay coastlines through Simon’s Town, over the breathtaking cliffs of Chapman’s Peak Drive, and up the legendary Suikerbossie climb before finishing along the Sea Point promenade in Green Point.\n\nA shorter 42 km route is also typically hosted for developing riders and families. Dates, entry windows, and route configurations are sample placeholders and should be verified directly with the official Cape Town Cycle Tour Trust.',
    imageUrl:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=85',
    websiteUrl: 'https://www.capetowncycletour.com',
    distanceSummary: '109 km / 42 km (Indicative)',
    terrainSummary: 'Sealed coastal tarmac & mountain passes',
    formatSummary: 'Single-day mass participation road classic',
    transport: {
      available: true,
      summary:
        'Roll-on, roll-off fully assembled bicycle transport via Bicycle Logistics (bicyclelogistics.co.za) from Gauteng, KwaZulu-Natal, Eastern Cape, and Garden Route straight to the Cape Town Stadium precinct.',
      collectionHubs: [
        'Johannesburg (Sandton, Fourways & Bedfordview)',
        'Pretoria (Menlyn & Centurion)',
        'Durban (Umhlanga & Hillcrest)',
        'Gqeberha & George Depots',
      ],
      dropOffPoint:
        'Dedicated Bicycle Logistics Compound near DHL Stadium / Green Point Precinct, Cape Town',
      cutoffNotice:
        'Bookings typically close 10 days prior to race weekend or once custom trailer capacity is reached.',
      includedServices: [
        'Fully assembled upright transport in custom enclosed trailers (no boxing or dismantling required)',
        'Individual wheel-clamped slots built by cyclists for cyclists',
        'Secure storage at the Cape Town race village until rider collection',
        'Post-race handover immediately after crossing the Green Point finish line',
      ],
      enquiryUrl: 'https://www.bicyclelogistics.co.za/',
    },
  },
  {
    id: '947-ride-joburg',
    name: 'The 947 Ride Joburg',
    tagline: 'Conquer the streets and highways of the City of Gold on fully closed roads',
    location: 'Johannesburg, Gauteng',
    province: 'Gauteng',
    dateDisplay: 'Sample Date: Nov 2026 Window (TBC)',
    sortDate: '2026-11-16',
    isSampleDate: true,
    category: 'Road Cycling',
    featured: false,
    shortDescription:
      'Fast-paced urban road racing starting and finishing at FNB Stadium with full highway closures across iconic Johannesburg landmarks.',
    description:
      'The 947 Ride Joburg transforms South Africa’s bustling economic heartland into a cyclist’s playground. With complete road closures across major arterial routes including the M1 highway and Nelson Mandela Bridge, riders experience the unique thrill of racing through Johannesburg’s rolling urban hills.\n\nAlongside the signature 97 km road challenge, the event festival traditionally includes a 35 km Short Ride, MTB challenges at Steyn City, and kids’ rides. All dates shown are indicative sample dates; please consult the official Ride Joburg website for confirmed schedules.',
    imageUrl:
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=85',
    websiteUrl: 'https://ridejoburg.co.za',
    distanceSummary: '97 km Road / 35 km Short (Indicative)',
    terrainSummary: 'Closed urban highways & rolling city climbs',
    formatSummary: 'Single-day city road race (MTB weekend precedes)',
    transport: {
      available: true,
      summary:
        'Seamless inter-provincial bicycle transfers via Bicycle Logistics (bicyclelogistics.co.za) from Cape Town, Winelands, Garden Route, and Durban directly to Johannesburg ahead of registration.',
      collectionHubs: [
        'Cape Town (City Bowl, Claremont & Bellville)',
        'Stellenbosch & Somerset West',
        'Durban (Umhlanga & Westville)',
        'Bloemfontein & Nelspruit Partner Shops',
      ],
      dropOffPoint:
        'FNB Stadium Hospitality & Logistics Zone / Nominated Sandton Partner Hub',
      cutoffNotice:
        'Early reservation advised; coastal-to-Gauteng shuttles depart 5 days before race day.',
      includedServices: [
        'Upright high-care bike transport without removing pedals or handlebars',
        'Dedicated individual slot inside enclosed custom bicycle trailer',
        'Immediate post-race bike drop-off at FNB Stadium hospitality zone',
        'Return delivery to your originating partner bike shop within 4 days',
      ],
      enquiryUrl: 'https://www.bicyclelogistics.co.za/',
    },
  },
  {
    id: 'wines2whales',
    name: 'Wines2Whales',
    tagline: 'Three days of world-class singletrack from the Lourensford vineyards to Hermanus',
    location: 'Oak Valley to Hermanus, Western Cape',
    province: 'Western Cape',
    dateDisplay: 'Sample Date: Nov 2026 Window (TBC)',
    sortDate: '2026-11-22',
    isSampleDate: true,
    category: 'Mountain Biking',
    featured: false,
    shortDescription:
      'A premier 3-stage MTB team event linking the Elgin Valley apple orchards and Botrivier lagoons with the whale-watching coast of Hermanus.',
    description:
      'Born from the spirit of riding from the wineries of the Cape to the whales of the Overberg coast, Wines2Whales (Chardonnay, Pinotage, and Shiraz events) is celebrated for its meticulously sculpted singletrack, timber bridges, and vibrant race village camaraderie.\n\nRiders traverse private farms, mountain passes (including the historic Gantouw Pass portage), and fynbos corridors between Oak Valley Estate in Elgin and Benguela Cove / Onrus near Hermanus. Sample dates are displayed for planning purposes only.',
    imageUrl:
      'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?auto=format&fit=crop&w=1200&q=85',
    websiteUrl: 'https://www.epic-series.com/wines2whales',
    distanceSummary: '~60–70 km per stage (3 Stages)',
    terrainSummary: 'Sculpted singletrack, jeep track & fynbos trails',
    formatSummary: '3-day stage race (Chardonnay, Pinotage & Shiraz)',
    transport: {
      available: true,
      summary:
        'End-to-end stage race bike logistics via Bicycle Logistics (bicyclelogistics.co.za) including nationwide trunk transport PLUS point-to-point transfers between Oak Valley and Hermanus.',
      collectionHubs: [
        'Johannesburg & Pretoria Depots',
        'Durban & Pietermaritzburg Hubs',
        'Cape Town International Airport & City Hubs',
        'George & Knysna Partner Stores',
      ],
      dropOffPoint:
        'Oak Valley / Lourensford Start Venue & Onrus / Hermanus Finish Chill Zone',
      cutoffNotice:
        'Specify your riding batch (Chardonnay, Pinotage, or Shiraz) when requesting a transport slot.',
      includedServices: [
        'Pre-race delivery straight to the Stage 1 start paddock',
        'Post-Stage 3 bike collection at the Hermanus finish line',
        'Roll-on / roll-off enclosed trailer slots with zero disassembly',
        'Luggage and gear bag coordination during the 3-day stage race',
      ],
      enquiryUrl: 'https://www.bicyclelogistics.co.za/',
    },
  },
  {
    id: 'ironman-south-africa',
    name: 'IRONMAN African Championship',
    tagline: 'Swim Algoa Bay, bike the rugged Wildside coast, and run the Nelson Mandela Bay beachfront',
    location: 'Gqeberha (Port Elizabeth), Eastern Cape',
    province: 'Eastern Cape',
    dateDisplay: 'Sample Date: Apr 2027 Window (TBC)',
    sortDate: '2027-04-11',
    isSampleDate: true,
    category: 'Triathlon',
    featured: false,
    shortDescription:
      'Africa’s premier long-distance triathlon featuring a fast, wind-tested 180 km coastal bike leg in Nelson Mandela Bay.',
    description:
      'Hosted in the friendly coastal city of Gqeberha, the IRONMAN African Championship (alongside IRONMAN 70.3 Nelson Mandela Bay) brings together triathletes from across the globe. Starting with a sheltered ocean swim at Hobie Beach, athletes embark on a demanding 180.2 km bicycle course along Marine Drive and through the scenic Eastern Cape countryside before completing a spectator-lined 42.2 km marathon run.\n\nTime-trial and aero road bikes require specialized transport care to preserve cockpit fit and electronic shifting calibration. All dates are sample estimates.',
    imageUrl:
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=85',
    websiteUrl: 'https://www.ironman.com/im-south-africa',
    distanceSummary: '3.8 km Swim • 180 km Bike • 42.2 km Run',
    terrainSummary: 'Exposed coastal tar roads & rolling rural highways',
    formatSummary: 'Full-distance & 70.3 championship triathlon',
    transport: {
      available: true,
      summary:
        'Specialist TT and triathlon bike transport with Bicycle Logistics (bicyclelogistics.co.za) — zero cockpit disassembly required, delivering straight to the Boardwalk transition precinct in Summerstrand.',
      collectionHubs: [
        'Johannesburg & Pretoria Tri-Hubs',
        'Cape Town & Winelands Depots',
        'Durban North & Ballito Partner Stores',
        'East London & Garden Route',
      ],
      dropOffPoint:
        'The Boardwalk Hotel & Convention Centre Precinct, Summerstrand, Gqeberha',
      cutoffNotice:
        'TT/Triathlon slots require booking at least 14 days prior due to wide-bay aero handlebar spacing.',
      includedServices: [
        'No handlebar or aero-extension disassembly — preserve your exact bike fit',
        'Deep-section carbon wheelset protection & individual wheel clamping',
        'Delivery prior to official bike check-in at Hobie Beach transition',
        'Wetsuit and transition gear bag transport option',
      ],
      enquiryUrl: 'https://www.bicyclelogistics.co.za/',
    },
  },
  {
    id: 'swartberg-100-gran-fondo',
    name: 'Swartberg 100 Gran Fondo',
    tagline: 'Tackle the legendary UNESCO World Heritage gravel of the Swartberg Pass',
    location: 'Prince Albert, Western Cape',
    province: 'Western Cape',
    dateDisplay: 'Sample Date: Apr 2027 Window (TBC)',
    sortDate: '2027-04-25',
    isSampleDate: true,
    category: 'Gravel',
    featured: false,
    shortDescription:
      'A quintessential Karoo gravel and mixed-surface classic ascending Thomas Bain’s historic dry-stone Swartberg Pass.',
    description:
      'Set in the dramatic Great Karoo town of Prince Albert, the Swartberg 100 Gran Fondo blends smooth tarmac sectors with monumental gravel climbs. The centrepiece of the 170 km route is the iconic unpaved Swartberg Pass — climbing to 1,583 metres above sea level via hand-built dry-stone switchbacks constructed in the 1880s.\n\nWith crisp Karoo air, sweeping desert vistas, and challenging gravel gradients, it is a bucket-list test for gravel and endurance riders across Southern Africa. Dates shown are sample placeholders.',
    imageUrl:
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=85',
    websiteUrl: 'https://swartberg100.com',
    distanceSummary: '170 km Gran Fondo / 105 km Medio (Indicative)',
    terrainSummary: 'Karoo gravel sectors, historic mountain pass & tar',
    formatSummary: 'UCI Gravel World Series / Gran Fondo classic',
    transport: {
      available: true,
      summary:
        'Direct Karoo shuttle logistics via Bicycle Logistics (bicyclelogistics.co.za) transporting gravel and endurance bikes to Prince Albert from major metropolitan hubs.',
      collectionHubs: [
        'Cape Town & Stellenbosch',
        'George Airport & Oudtshoorn',
        'Johannesburg & Pretoria',
        'Gqeberha Depot',
      ],
      dropOffPoint: 'Prince Albert Race Village Registration Courtyard',
      cutoffNotice:
        'Remote Karoo routing closes 10 days before event weekend.',
      includedServices: [
        'Wide-clearance rack fittings for 40–50mm gravel tyres',
        'Dust-sealed enclosed box trailer transport across the Karoo',
        'Track-pump and tubeless inflation station at collection',
        'Post-race handover at the Showroom Theatre finish precinct',
      ],
      enquiryUrl: 'https://www.bicyclelogistics.co.za/',
    },
  },
  {
    id: 'sani2c',
    name: 'kapow! sani2c',
    tagline: 'From the Southern Drakensberg mountains to the warm Indian Ocean coast',
    location: 'Underberg to Scottburgh, KwaZulu-Natal',
    province: 'KwaZulu-Natal',
    dateDisplay: 'Sample Date: May 2027 Window (TBC)',
    sortDate: '2027-05-13',
    isSampleDate: true,
    category: 'Mountain Biking',
    featured: false,
    shortDescription:
      'South Africa’s iconic point-to-point 3-day MTB stage race descending 265 km from Underberg through the Umkomaas Valley to Scottburgh beach.',
    description:
      'Founded by farmer Glen Haw, sani2c (Trail, Adventure, and Race editions) is one of the world’s largest and best-loved point-to-point mountain bike stage races. Riders start at Glencairn Farm in the shadow of Sani Pass (Underberg), overnighting at Mackenzie Club in Ixopo and Jolivet Farm before crossing the iconic floating lagoon bridge onto Scottburgh Main Beach.\n\nBecause sani2c starts high in the Drakensberg foothills and finishes 265 km away on the KZN South Coast, reliable point-to-point bicycle logistics are essential for every rider. Dates are indicative sample windows.',
    imageUrl:
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=85',
    websiteUrl: 'https://sani2c.co.za',
    distanceSummary: '~265 km Total (3 Point-to-Point Stages)',
    terrainSummary: 'Drakensberg singletrack, Umkomaas valley & coastal trails',
    formatSummary: '3-day point-to-point team MTB stage race',
    transport: {
      available: true,
      summary:
        'Crucial point-to-point logistics by Bicycle Logistics (bicyclelogistics.co.za): drop your bike at your local hub, collect it ready-to-ride at Glencairn Farm in Underberg, and hand it back on Scottburgh Beach.',
      collectionHubs: [
        'Johannesburg & Pretoria (Multiple Hubs)',
        'Durban, Umhlanga & Hillcrest',
        'King Shaka International Airport',
        'Cape Town, Stellenbosch & Bloemfontein',
      ],
      dropOffPoint:
        'Start: Glencairn Farm (Underberg) • Finish Collection: Scottburgh Main Beach',
      cutoffNotice:
        'Book early and specify whether you are riding the Trail, Adventure, or Race edition.',
      includedServices: [
        'Split-venue delivery to Glencairn Farm (Underberg) and collection at Scottburgh Beach',
        'Eliminates the need for private vehicle transfers between Underberg and the coast',
        'Roll-on / roll-off enclosed trailer slots with wheel clamping protection',
        'Cleaned bike return to your hometown depot within 72 hours of finish',
      ],
      enquiryUrl: 'https://www.bicyclelogistics.co.za/',
    },
  },
  {
    id: 'trans-baviaans',
    name: 'Trans Baviaans',
    tagline: '230 km non-stop through the rugged heart of the Baviaanskloof Mega-Reserve',
    location: 'Willowmore to Jeffreys Bay, Eastern Cape',
    province: 'Eastern Cape',
    dateDisplay: 'Sample Date: Aug 2027 Window (TBC)',
    sortDate: '2027-08-14',
    isSampleDate: true,
    category: 'Ultra Cycling',
    featured: false,
    shortDescription:
      'Known as the toughest single-stage 24-hour MTB and ultra-endurance marathon in South Africa, crossing remote wilderness from the Karoo to the sea.',
    description:
      'Starting at 10:00 AM in the cold Karoo town of Willowmore, Trans Baviaans challenges teams of two to four riders to cover 230 km non-stop inside a 24-hour cutoff to reach Fountains Mall in Jeffreys Bay. Riders navigate low-water river crossings, the grueling MAC pass ("Mother of All Climbs"), and freezing night hours through the UNESCO-listed Baviaanskloof wilderness.\n\nWith start and finish towns separated by hundreds of kilometres of mountain wilderness, point-to-point bike and support-box transport is a cornerstone of a successful race plan. Dates shown are sample placeholders.',
    imageUrl:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85',
    websiteUrl: 'https://www.transbaviaans.co.za',
    distanceSummary: '230 km Non-Stop (24-Hour Cutoff)',
    terrainSummary: 'Wilderness district roads, river crossings & steep passes',
    formatSummary: '24-hour ultra-endurance point-to-point team marathon',
    transport: {
      available: true,
      summary:
        'Point-to-point wilderness logistics via Bicycle Logistics (bicyclelogistics.co.za) delivering bikes to Willowmore and collecting from the Jeffreys Bay finish village.',
      collectionHubs: [
        'Cape Town, Somerset West & George',
        'Gqeberha & Jeffreys Bay Pre-Drop',
        'Johannesburg & Pretoria',
        'Durban & Bloemfontein',
      ],
      dropOffPoint:
        'Start: Willowmore Country Club • Finish: Jeffreys Bay Finish Village',
      cutoffNotice:
        'Indicate Race Weekend 1 or The Repeat (Weekend 2) when booking.',
      includedServices: [
        'Bike delivery to Willowmore start venue & collection at Jeffreys Bay finish',
        'Option for Jeffreys Bay-based riders to drop bikes in J-Bay for transfer to Willowmore',
        '24-hour staffed finish depot in Jeffreys Bay for night and morning finishers',
        'Secure transport for lighting kits and spare wheelsets',
      ],
      enquiryUrl: 'https://www.bicyclelogistics.co.za/',
    },
  },
  {
    id: 'amashova-durban-classic',
    name: 'Amashova Durban Classic',
    tagline: 'South Africa’s oldest classic road race following the historic Comrades route',
    location: 'Pietermaritzburg to Durban, KwaZulu-Natal',
    province: 'KwaZulu-Natal',
    dateDisplay: 'Sample Date: Oct 2027 Window (TBC)',
    sortDate: '2027-10-17',
    isSampleDate: true,
    category: 'Road Cycling',
    featured: false,
    shortDescription:
      'A classic 106 km point-to-point road race rolling from Pietermaritzburg City Hall through the Valley of a Thousand Hills to the Durban beachfront.',
    description:
      'First staged in 1986, the Amashova Durban Classic traces the famous hills between Pietermaritzburg and Durban under full road closure. Cyclists tackle Inchanga, Botha’s Hill, and 45th Cutting before enjoying a fast descent towards Moses Mabhida Stadium and the Suncoast beachfront.\n\nBecause the race starts inland in Pietermaritzburg and finishes on the Durban coast, Bicycle Logistics offers convenient start-line delivery and coastal collection alongside nationwide transfers. Dates are sample estimates.',
    imageUrl:
      'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?auto=format&fit=crop&w=1200&q=85',
    websiteUrl: 'https://www.shova.co.za',
    distanceSummary: '106 km Classic / 65 km / 38 km (Indicative)',
    terrainSummary: 'Point-to-point rolling tarmac with full road closure',
    formatSummary: 'Single-day point-to-point road race',
    transport: {
      available: true,
      summary:
        'National bicycle transfers to KZN plus race-morning logistics to Pietermaritzburg City Hall and collection at the Durban beachfront finish via Bicycle Logistics (bicyclelogistics.co.za).',
      collectionHubs: [
        'Johannesburg & Pretoria',
        'Durban North & Umhlanga',
        'Cape Town & Winelands',
        'Pietermaritzburg Depot',
      ],
      dropOffPoint:
        'Pietermaritzburg Start Precinct & Suncoast / Moses Mabhida Finish Zone',
      cutoffNotice:
        'Book at least 7 days before race weekend to secure Pietermaritzburg start delivery.',
      includedServices: [
        'Upright custom rack transport from Gauteng & Western Cape',
        'Point-to-point KZN handling from Pietermaritzburg start to Durban finish',
        'Comprehensive transit protection in enclosed trailers',
        'Fast turnaround back to your local hub',
      ],
      enquiryUrl: 'https://www.bicyclelogistics.co.za/',
    },
  },
];
