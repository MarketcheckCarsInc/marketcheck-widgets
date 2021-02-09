export interface ApiCarActiveResponse {
  num_found: string;
  listings: ApiCarActiveListing[];
  stats: {};
}

export interface ApiCarActiveListing {
  id: string;
  vin: string;
  heading: string;
  price: number;
  miles: number;
  msrp: number;
  data_source: string;
  vdp_url: string;
  carfax_1_owner: boolean;
  carfax_clean_title: boolean;
  exterior_color: string;
  interior_color: string;
  dom: number;
  dom_180: number;
  dom_active: number;
  seller_type: string;
  inventory_type: string;
  stock_no: number;
  last_seen_at: number;
  scraped_at: number;
  first_seen_at: number;
  ref_price: number;
  ref_miles: number;
  ref_miles_dt: number;
  source: string;
  media: {
    photo_links: string[];
  };
  dealer: {
    id: number;
    website: string;
    name: string;
    dealer_type: string;
    street: string;
    city: string;
    state: string;
    country: string;
    latitude: string;
    longitude: string;
    zip: string;
    msa_code: string;
    phone: string;
    seller_email: string;
  };
  build: {
    year: number;
    make: string;
    model: string;
    trim: string;
    body_type: string;
    vehicle_type: string;
    transmission: string;
    drivetrain: string;
    fuel_type: string;
    engine: string;
    engine_size: number;
    engine_block: string;
    doors: number;
    cylinders: number;
    made_in: string;
    overall_height: string;
    overall_length: string;
    overall_width: string;
    std_seating: string;
  };
}

export interface ApiCarHistoryListing {
  id: string;
  price: number;
  miles: number;
  data_source: string;
  vdp_url: string;
  seller_type: string;
  inventory_type: string;
  last_seen_at: number;
  last_seen_at_date: string;
  scraped_at: number;
  scraped_at_date: string;
  first_seen_at: number;
  first_seen_at_date: string;
  source: string;
  seller_name: string;
  city: string;
  state: string;
  zip: string;
  status_date: number;
}
export interface ApiCarMDSResponse {
  mds: number;
  total_active_cars_for_ymmt: number;
  total_cars_sold_in_last_45_days: number;
  sold_vins: string[];
}

export interface ApiCarVINDecoder {
  vin: string;
  is_valid: boolean;
  decode_mode: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  body_type: string;
  vehicle_type: string;
  transmission: string;
  drivetrain: string;
  fuel_type: string;
  engine: string;
  engine_size: number;
  doors: number;
  cylinders: number;
  made_in: string;
  overall_height: string;
  overall_length: string;
  overall_width: string;
  std_seating: string;
  highway_mpg: number;
  city_mpg: number;
  mileage: {};
}

export interface ApiListingCarResponse {
  id: string;
  vin: string;
  heading: string;
  price: number;
  miles: number;
  msrp: number;
  data_source: string;
  vdp_url: string;
  carfax_1_owner: boolean;
  carfax_clean_title: boolean;
  exterior_color: string;
  interior_color: string;
  base_int_color: string;
  base_ext_color: string;
  dom: number;
  dom_180: number;
  dom_active: number;
  seller_type: string;
  inventory_type: string;
  stock_no: string;
  last_seen_at: number;
  last_seen_at_date: string;
  scraped_at: number;
  scraped_at_date: string;
  first_seen_at: number;
  first_seen_at_date: string;
  source: string;
  media: {
    photo_links: string[];
  };
  extra: {
    features: string[];
    exterior_f: string[];
    standard_f: string[];
    interior_f: string[];
    safety_f: string[];
    seller_comments: string;
  };
  dealer: {
    id: number;
    website: string;
    name: string;
    dealer_type: string;
    street: string;
    city: string;
    state: string;
    country: string;
    latitude: string;
    longitude: string;
    zip: string;
    msa_code: string;
    phone: string;
  };
  build: {
    year: number;
    make: string;
    model: string;
    trim: string;
    body_type: string;
    vehicle_type: string;
    transmission: string;
    drivetrain: string;
    fuel_type: string;
    engine: string;
    engine_size: number;
    engine_block: string;
    doors: number;
    cylinders: number;
    made_in: string;
    overall_height: string;
    overall_length: string;
    overall_width: string;
    std_seating: string;
    highway_mpg: number;
    city_mpg: number;
  };
}
export interface ApiPopularCar {
  country: string;
  inventory_type: string;
  count: number;
  make: string;
  model: string;
  price_stats: {
    geometric_mean: number;
    listings_count: number;
    min: number;
    median: number;
    population_standard_deviation: number;
    variance: number;
    max: number;
    mean: number;
    trimmed_mean: number;
    standard_deviation: number;
    iqr: number;
  };
  miles_stats: {
    geometric_mean: number;
    listings_count: number;
    min: number;
    median: number;
    population_standard_deviation: number;
    variance: number;
    max: number;
    mean: number;
    trimmed_mean: number;
    standard_deviation: number;
    iqr: number;
  };
  dom_stats: {
    geometric_mean: number;
    listings_count: number;
    min: number;
    median: number;
    population_standard_deviation: number;
    variance: number;
    max: number;
    mean: number;
    trimmed_mean: number;
    standard_deviation: number;
    iqr: number;
  };
}

export interface ApiCarVINDecoderEpi {
  message: string;
  session: string;
  vINDataSources: EPIVINDataSource[];
  vIN: string;
}

export interface EPIVINDataSource {
  dataSourceName: string;
  status: string;
  vehicleInfo: EPIVehicleInfo[];
}

export interface EPIVehicleInfo {
  availableOptionsDetails: EPIOptionPackage[];
  availablePaint: EPIPaint[];
  bodyStyleName: string;
  cabType: string;
  drivenWheels: string;
  features: EPIFeature[];
  genericBodyStyleName: string;
  installedEquipment: EPIEquipment[];
  installedOptionsDetails: EPIOptionPackage[];
  makeName: string;
  manufacturerCode: string;
  modelName: string;
  modelYear: string;
  mSRP: string;
  numberOfDoors: string;
  optionsPackages: string;
  paint: EPIPaint[];
  photos: string[];
  transmissionType: string;
  trimName: string;
  versionName: string;
}

export interface EPIOptionPackage {
  name: string;
  optionCode: string;
  optionPackageEquipment: EPIEquipment[];
  type: string;
}

export interface EPIEquipment {
  attribute: string;
  category: string;
  item: string;
  location: string;
  value: string;
}

export interface EPIPaint {
  code: string;
  genericColor: string;
  name: string;
}
export interface EPIFeature {
  category: string;
  name: string;
}
