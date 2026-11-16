export type EventCategory =
  | 'All Events'
  | 'Road Cycling'
  | 'Mountain Biking'
  | 'Gravel'
  | 'Ultra Cycling'
  | 'Triathlon';

export type ExcludeAllCategory = Exclude<EventCategory, 'All Events'>;

export type SouthAfricanProvince =
  | 'All Locations'
  | 'Western Cape'
  | 'Gauteng'
  | 'KwaZulu-Natal'
  | 'Eastern Cape';

export interface BicycleTransportInfo {
  available: boolean;
  summary: string;
  collectionHubs: string[];
  dropOffPoint: string;
  cutoffNotice: string;
  includedServices: string[];
  enquiryUrl: string;
}

export interface CyclingEvent {
  id: string;
  name: string;
  tagline: string;
  location: string;
  province: Exclude<SouthAfricanProvince, 'All Locations'>;
  dateDisplay: string;
  sortDate: string;
  isSampleDate: boolean;
  category: ExcludeAllCategory;
  shortDescription: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  featured?: boolean;
  distanceSummary: string;
  terrainSummary: string;
  formatSummary: string;
  transport: BicycleTransportInfo;
}

export type InspectionCategoryId =
  | 'brakes'
  | 'tyres-wheels'
  | 'drivetrain'
  | 'frame-components';

export type PackingCategoryId =
  | 'bicycle-equipment'
  | 'personal-essentials'
  | 'travel-event-items';

export type RaceDayCategoryId =
  | 'before-leaving'
  | 'before-race'
  | 'after-race';

export interface PrepChecklistItem {
  id: string;
  label: string;
  detail?: string;
  isCustom?: boolean;
}

export interface PrepChecklistSection<TCategoryId extends string = string> {
  id: TCategoryId;
  title: string;
  subtitle: string;
  items: PrepChecklistItem[];
}

export type BicycleType = 'Road' | 'Mountain Bike' | 'Gravel';

export type RidingCondition = 'Smooth' | 'Mixed' | 'Rough';

export interface TyrePressurePreferences {
  bicycleType: BicycleType;
  tyreWidthMm: number;
  riderWeightKg: number;
  condition: RidingCondition;
  isTubeless: boolean;
}

export interface TyrePressureRecommendation {
  frontPsi: number;
  rearPsi: number;
  averagePsi: number;
  frontBar: number;
  rearBar: number;
  averageBar: number;
  minSafeHintPsi: number;
  maxSafeHintPsi: number;
}

export interface CustomPackingItem {
  id: string;
  categoryId: PackingCategoryId;
  label: string;
  createdAt: string;
}

export interface BikePrepPersistedState {
  inspectionChecked: Record<string, boolean>;
  packingChecked: Record<string, boolean>;
  raceDayChecked: Record<string, boolean>;
  customPackingItems: CustomPackingItem[];
  tyrePressure: TyrePressurePreferences;
  lastUpdatedIso: string | null;
}
