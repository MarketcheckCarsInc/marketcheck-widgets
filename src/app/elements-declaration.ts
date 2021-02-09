import { SimilarCarsComponent } from "./similar-cars/similar-cars.component";

import { TimeOnMarketComponent } from "./time-on-market/time-on-market.component";
import { PopularCarsComponent } from "./popular-cars/popular-cars.component";
import { BuyerIntelligenceComponent } from "./buyer-intelligence/buyer-intelligence.component";
import { CarHistoryComponent } from "./car-history/car-history.component";
import { CarBasicsComponent } from "./car-basics/car-basics.component";
import { SellerInfoComponent } from "./seller-info/seller-info.component";
import { VdpFeaturesComponent } from "./vdp-features/vdp-features.component";
import { CarCardComponent } from "./car-card/car-card.component";
import { CarsDemandIndicatorComponent } from "./cars-demand-indicator/cars-demand-indicator.component";

import { PriceMilesPlotComponent } from "./price-miles-plot/price-miles-plot.component";
import { FuelEconomyComponent } from "./fuel-economy/fuel-economy.component";
import { CarSafetyBreakupComponent } from "./car-safety-breakup/car-safety-breakup.component";

export class ElementsDeclaration {
  static declarations = [
    // add declarations for your elements.
    { component: SellerInfoComponent, tagName: "seller-info" },
    { component: SimilarCarsComponent, tagName: "similar-cars" },
    { component: VdpFeaturesComponent, tagName: "car-features" },
    { component: CarBasicsComponent, tagName: "car-basics" },
    { component: CarCardComponent, tagName: "car-card" },
    { component: CarHistoryComponent, tagName: "car-history" },
    { component: CarsDemandIndicatorComponent, tagName: "car-demand" },
    { component: BuyerIntelligenceComponent, tagName: "buyer-intelligence" },
    { component: PriceMilesPlotComponent, tagName: "price-miles-plot" },
    { component: TimeOnMarketComponent, tagName: "time-on-market" },
    { component: FuelEconomyComponent, tagName: "fuel-economy" },
    { component: PopularCarsComponent, tagName: "popular-cars" },
    { component: CarSafetyBreakupComponent, tagName: "car-safety-breakup" },
  ];
}
