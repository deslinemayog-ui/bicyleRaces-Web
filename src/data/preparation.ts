import {
  BicycleType,
  InspectionCategoryId,
  PackingCategoryId,
  PrepChecklistSection,
  RaceDayCategoryId,
  RidingCondition,
  TyrePressurePreferences,
  TyrePressureRecommendation,
} from '../types';

export const BICYCLE_INSPECTION_SECTIONS: PrepChecklistSection<InspectionCategoryId>[] =
  [
    {
      id: 'brakes',
      title: 'Brakes',
      subtitle: 'Stopping power, lever feel & hydraulic/cable integrity',
      items: [
        {
          id: 'insp-brakes-front',
          label: 'Check front brake functionality.',
          detail: 'Ensure firm lever engagement and smooth calliper release.',
        },
        {
          id: 'insp-brakes-rear',
          label: 'Check rear brake functionality.',
          detail: 'Verify consistent modulation and full stopping power.',
        },
        {
          id: 'insp-brakes-pads',
          label: 'Inspect brake pads.',
          detail: 'Confirm at least 1.5 mm of pad material and even wear.',
        },
        {
          id: 'insp-brakes-lines',
          label: 'Inspect brake cables or hydraulic lines.',
          detail: 'Check for fraying, kinks, or fluid leaks near fittings.',
        },
      ],
    },
    {
      id: 'tyres-wheels',
      title: 'Tyres and Wheels',
      subtitle: 'Tread integrity, true rims & axle clamping security',
      items: [
        {
          id: 'insp-tyres-condition',
          label: 'Check tyre condition.',
          detail: 'Inspect tread wear indicators and sidewall suppleness.',
        },
        {
          id: 'insp-tyres-cuts',
          label: 'Inspect for cuts or punctures.',
          detail: 'Remove embedded glass, thorns, or flint debris from casing.',
        },
        {
          id: 'insp-wheels-alignment',
          label: 'Check wheel alignment.',
          detail: 'Spin both wheels to verify lateral true and spoke tension.',
        },
        {
          id: 'insp-wheels-axle',
          label: 'Check quick-release or thru-axle security.',
          detail: 'Confirm axles are torqued properly before transit or riding.',
        },
      ],
    },
    {
      id: 'drivetrain',
      title: 'Drivetrain',
      subtitle: 'Crisp indexing, chain wear & race-ready lubrication',
      items: [
        {
          id: 'insp-drive-chain',
          label: 'Inspect chain condition.',
          detail: 'Check for stiff links, rust spots, or elongation beyond 0.5%.',
        },
        {
          id: 'insp-drive-shifting',
          label: 'Check gear shifting.',
          detail: 'Shift through the full rear cassette and front chainrings.',
        },
        {
          id: 'insp-drive-cassette',
          label: 'Inspect cassette and chainrings.',
          detail: 'Check teeth for shark-fin wear, bent cogs, or buildup.',
        },
        {
          id: 'insp-drive-lube',
          label: 'Lubricate the chain if necessary.',
          detail: 'Apply condition-appropriate lube and wipe off excess.',
        },
      ],
    },
    {
      id: 'frame-components',
      title: 'Frame and Components',
      subtitle: 'Structural inspection & cockpit/contact-point torque',
      items: [
        {
          id: 'insp-frame-cracks',
          label: 'Inspect frame for cracks or damage.',
          detail: 'Check bottom bracket, head tube, stays, and fork crown.',
        },
        {
          id: 'insp-frame-handlebar',
          label: 'Check handlebar security.',
          detail: 'Verify faceplate bolts, stem alignment, and headset play.',
        },
        {
          id: 'insp-frame-saddle',
          label: 'Check saddle and seat post.',
          detail: 'Confirm saddle rails and seat post clamp are torqued to spec.',
        },
        {
          id: 'insp-frame-pedals',
          label: 'Check pedals and crank arms.',
          detail: 'Ensure zero bearing play and secure crank fixing bolts.',
        },
      ],
    },
  ];

export const PACKING_CHECKLIST_SECTIONS: PrepChecklistSection<PackingCategoryId>[] =
  [
    {
      id: 'bicycle-equipment',
      title: 'Bicycle Equipment',
      subtitle: 'Riding kit, hydration & on-bike mechanical spares',
      items: [
        { id: 'pack-equip-helmet', label: 'Helmet' },
        { id: 'pack-equip-shoes', label: 'Cycling shoes' },
        { id: 'pack-equip-gloves', label: 'Gloves' },
        { id: 'pack-equip-sunglasses', label: 'Sunglasses' },
        { id: 'pack-equip-bottles', label: 'Water bottles' },
        { id: 'pack-equip-tubes', label: 'Spare tubes' },
        { id: 'pack-equip-levers', label: 'Tyre levers' },
        { id: 'pack-equip-pump', label: 'Mini pump or CO2 inflator' },
        { id: 'pack-equip-multitool', label: 'Multi-tool' },
        { id: 'pack-equip-chainlink', label: 'Spare chain link' },
      ],
    },
    {
      id: 'personal-essentials',
      title: 'Personal Essentials',
      subtitle: 'Identification, race nutrition & weather protection',
      items: [
        { id: 'pack-pers-id', label: 'ID document' },
        { id: 'pack-pers-phone', label: 'Phone' },
        { id: 'pack-pers-wallet', label: 'Wallet' },
        { id: 'pack-pers-sunscreen', label: 'Sunscreen' },
        { id: 'pack-pers-gels', label: 'Energy gels' },
        { id: 'pack-pers-snacks', label: 'Snacks' },
        { id: 'pack-pers-clothing', label: 'Cycling clothing' },
        { id: 'pack-pers-rainjacket', label: 'Rain jacket' },
      ],
    },
    {
      id: 'travel-event-items',
      title: 'Travel and Event Items',
      subtitle: 'Registration docs, Bicycle Logistics confirmation & recovery',
      items: [
        {
          id: 'pack-travel-reg',
          label: 'Race registration confirmation',
          detail: 'Race number SMS/email & cycling federation license if applicable.',
        },
        {
          id: 'pack-travel-transport',
          label: 'Transport booking confirmation',
          detail: 'Bicycle Logistics (bicyclelogistics.co.za) depot drop-off & race village collection reference.',
        },
        {
          id: 'pack-travel-accessories',
          label: 'Bicycle accessories',
          detail: 'GPS cycling computer, heart-rate monitor, lights & charging cables.',
        },
        { id: 'pack-travel-recovery', label: 'Recovery clothing' },
        { id: 'pack-travel-toiletries', label: 'Toiletries' },
      ],
    },
  ];

export const RACE_DAY_CHECKLIST_SECTIONS: PrepChecklistSection<RaceDayCategoryId>[] =
  [
    {
      id: 'before-leaving',
      title: 'Before Leaving',
      subtitle: 'Final morning checks before heading to the start venue',
      items: [
        {
          id: 'race-leave-reg',
          label: 'Confirm race registration.',
          detail: 'Timing chip, batch sticker, and emergency contact wristband ready.',
        },
        {
          id: 'race-leave-time',
          label: 'Check race start time.',
          detail: 'Verify your chute batch open and gun-start times.',
        },
        {
          id: 'race-leave-weather',
          label: 'Check weather conditions.',
          detail: 'Review wind direction, temperature range, and rain probability.',
        },
        {
          id: 'race-leave-transport',
          label: 'Confirm transport arrangements.',
          detail: 'Verify venue parking, shuttle schedule, or Bicycle Logistics compound location.',
        },
        {
          id: 'race-leave-bike',
          label: 'Check bicycle condition.',
          detail: 'Quick visual check of tyres, cockpit, and electronic shifter battery.',
        },
      ],
    },
    {
      id: 'before-race',
      title: 'Before the Race',
      subtitle: 'Start-paddock setup & pre-start activation',
      items: [
        {
          id: 'race-pre-tyres',
          label: 'Inflate tyres.',
          detail: 'Set target front and rear pressure for today’s surface conditions.',
        },
        {
          id: 'race-pre-brakes',
          label: 'Check brakes.',
          detail: 'Squeeze both levers and verify zero rotor or rim rub.',
        },
        {
          id: 'race-pre-bottles',
          label: 'Fill water bottles.',
          detail: 'Mix carbohydrate/electrolyte bottles and secure in cages.',
        },
        {
          id: 'race-pre-nutrition',
          label: 'Prepare nutrition.',
          detail: 'Pack gels, bars, and chews into jersey pockets or top-tube bag.',
        },
        {
          id: 'race-pre-number',
          label: 'Attach race number.',
          detail: 'Pin jersey number and secure handlebar/seatpost number board.',
        },
        {
          id: 'race-pre-warmup',
          label: 'Warm up.',
          detail: 'Spin legs lightly for 10–15 minutes before entering your start chute.',
        },
      ],
    },
    {
      id: 'after-race',
      title: 'After the Race',
      subtitle: 'Post-finish recovery, gear care & Bicycle Logistics handover',
      items: [
        {
          id: 'race-post-clean',
          label: 'Clean bicycle.',
          detail: 'Wipe down frame, stanchions, and drivetrain before return transit.',
        },
        {
          id: 'race-post-damage',
          label: 'Check for damage.',
          detail: 'Inspect tyres, derailleur hanger, and wheels after race effort.',
        },
        {
          id: 'race-post-rehydrate',
          label: 'Rehydrate.',
          detail: 'Replenish fluids, electrolytes, and post-race recovery nutrition.',
        },
        {
          id: 'race-post-belongings',
          label: 'Collect personal belongings.',
          detail: 'Gather helmet, cycling computer, shoes, and drop bags.',
        },
        {
          id: 'race-post-transport',
          label: 'Confirm bicycle collection or return transport arrangements.',
          detail: 'Hand over your assembled bicycle at the Bicycle Logistics finish compound.',
        },
      ],
    },
  ];

export const BICYCLE_TYPE_OPTIONS: {
  type: BicycleType;
  subtitle: string;
  defaultWidthMm: number;
  widthPresetsMm: number[];
  minWidthMm: number;
  maxWidthMm: number;
}[] = [
  {
    type: 'Road',
    subtitle: 'Tarmac racing & endurance road',
    defaultWidthMm: 28,
    widthPresetsMm: [25, 28, 30, 32, 35],
    minWidthMm: 23,
    maxWidthMm: 38,
  },
  {
    type: 'Gravel',
    subtitle: 'Karoo district roads & mixed terrain',
    defaultWidthMm: 42,
    widthPresetsMm: [38, 40, 42, 45, 50],
    minWidthMm: 33,
    maxWidthMm: 54,
  },
  {
    type: 'Mountain Bike',
    subtitle: 'XC, Marathon & SA stage races',
    defaultWidthMm: 58,
    widthPresetsMm: [53, 56, 58, 61, 64],
    minWidthMm: 48,
    maxWidthMm: 70,
  },
];

export const RIDING_CONDITION_OPTIONS: {
  condition: RidingCondition;
  description: string;
  adjustmentLabel: string;
}[] = [
  {
    condition: 'Smooth',
    description: 'Fast sealed tarmac or hardpack gravel with minimal bumps',
    adjustmentLabel: 'Baseline efficiency pressure',
  },
  {
    condition: 'Mixed',
    description: 'Varied South African chip-seal, corrugated gravel or trail',
    adjustmentLabel: '-5% for compliance & grip',
  },
  {
    condition: 'Rough',
    description: 'Rocky singletrack, wet roads, loose Karoo shale or technical terrain',
    adjustmentLabel: '-10% for maximum traction',
  },
];

export const DEFAULT_TYRE_PRESSURE_PREFS: TyrePressurePreferences = {
  bicycleType: 'Road',
  tyreWidthMm: 28,
  riderWeightKg: 75,
  condition: 'Mixed',
  isTubeless: true,
};

export function calculateTyrePressure(
  prefs: TyrePressurePreferences
): TyrePressureRecommendation {
  const clampedWeight = Math.min(Math.max(prefs.riderWeightKg || 75, 40), 140);
  const clampedWidth = Math.min(Math.max(prefs.tyreWidthMm || 28, 22), 75);

  let basePsi: number;
  let minSafeHintPsi: number;
  let maxSafeHintPsi: number;

  if (prefs.bicycleType === 'Road') {
    const widthDelta = clampedWidth - 28;
    const weightDelta = clampedWeight - 75;
    basePsi = 74 - widthDelta * 2.45 + weightDelta * 0.55;
    minSafeHintPsi = 48;
    maxSafeHintPsi = 105;
  } else if (prefs.bicycleType === 'Gravel') {
    const widthDelta = clampedWidth - 42;
    const weightDelta = clampedWeight - 75;
    basePsi = 35 - widthDelta * 0.85 + weightDelta * 0.28;
    minSafeHintPsi = 24;
    maxSafeHintPsi = 58;
  } else {
    const widthDelta = clampedWidth - 58;
    const weightDelta = clampedWeight - 75;
    basePsi = 23 - widthDelta * 0.42 + weightDelta * 0.18;
    minSafeHintPsi = 16;
    maxSafeHintPsi = 35;
  }

  const conditionMultiplier =
    prefs.condition === 'Smooth'
      ? 1.03
      : prefs.condition === 'Mixed'
        ? 0.97
        : 0.91;

  const setupDeltaPsi = prefs.isTubeless ? 0 : prefs.bicycleType === 'Road' ? 5 : 3;

  const adjustedAvgPsi = Math.min(
    Math.max(basePsi * conditionMultiplier + setupDeltaPsi, minSafeHintPsi),
    maxSafeHintPsi
  );

  const frontPsi = Math.round(
    Math.max(adjustedAvgPsi * 0.96, minSafeHintPsi)
  );
  const rearPsi = Math.round(
    Math.min(adjustedAvgPsi * 1.04, maxSafeHintPsi)
  );
  const averagePsi = Math.round((frontPsi + rearPsi) / 2);

  const psiToBar = (psi: number) => Number((psi * 0.0689476).toFixed(2));

  return {
    frontPsi,
    rearPsi,
    averagePsi,
    frontBar: psiToBar(frontPsi),
    rearBar: psiToBar(rearPsi),
    averageBar: psiToBar(averagePsi),
    minSafeHintPsi,
    maxSafeHintPsi,
  };
}
