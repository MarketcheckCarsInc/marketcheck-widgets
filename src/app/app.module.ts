import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { ElementsDeclaration } from "./elements-declaration";
import { PopularCarsComponent } from "./popular-cars/popular-cars.component";
import { SellerInfoComponent } from "./seller-info/seller-info.component";
import { SimilarCarsComponent } from "./similar-cars/similar-cars.component";
import { VdpFeaturesComponent } from "./vdp-features/vdp-features.component";
import { CarBasicsComponent } from "./car-basics/car-basics.component";
import { CarCardComponent } from "./car-card/car-card.component";
import { CarHistoryComponent } from "./car-history/car-history.component";
import { CarsDemandIndicatorComponent } from "./cars-demand-indicator/cars-demand-indicator.component";
import { BuyerIntelligenceComponent } from "./buyer-intelligence/buyer-intelligence.component";
import { PriceMilesPlotComponent } from "./price-miles-plot/price-miles-plot.component";
import { TimeOnMarketComponent } from "./time-on-market/time-on-market.component";
import { FuelEconomyComponent } from "./fuel-economy/fuel-economy.component";
import { CarSafetyBreakupComponent } from "./car-safety-breakup/car-safety-breakup.component";

@NgModule({
  declarations: [
    AppComponent,
    SellerInfoComponent,
    SimilarCarsComponent,
    VdpFeaturesComponent,
    CarBasicsComponent,
    CarCardComponent,
    CarHistoryComponent,
    CarsDemandIndicatorComponent,
    BuyerIntelligenceComponent,
    PriceMilesPlotComponent,
    TimeOnMarketComponent,
    FuelEconomyComponent,
    PopularCarsComponent,
    CarSafetyBreakupComponent,
  ],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    AppComponent,
    SellerInfoComponent,
    SimilarCarsComponent,
    VdpFeaturesComponent,
    CarBasicsComponent,
    CarCardComponent,
    CarHistoryComponent,
    CarsDemandIndicatorComponent,
    BuyerIntelligenceComponent,
    PriceMilesPlotComponent,
    TimeOnMarketComponent,
    FuelEconomyComponent,
    PopularCarsComponent,
    CarSafetyBreakupComponent,
  ],
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    ElementsDeclaration.declarations.map((entry) => {
      const el = createCustomElement(entry.component, {
        injector: this.injector,
      });
      customElements.define(entry.tagName, el);
    });
  }
}
