import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { ApiCarActiveListing, ApiCarHistoryListing } from "../api";
import { Observable } from "rxjs";

interface calculatedResponse {
  currentStats: number;
  historyStats: number;
  domActive: number;
}

@Injectable({
  providedIn: "root",
})
export class BuyerIntelligence {
  constructor(private apiService: ApiService) {}

  process(vin: string, accessToken: string, price: number, country: string) {
    let carSelect: ApiCarActiveListing;
    let similarListings: ApiCarActiveListing[];
    let historyResponse: ApiCarHistoryListing[];
    const processObservable = new Observable<calculatedResponse>(
      (subscriber) => {
        this.apiService
          .getCarActive({
            vin: vin,
            country: country,
            access_token: accessToken,
            identity: "mc-buyer-intelligence",
          })
          .subscribe({
            next: (value) => {
              carSelect = value.listings.shift();
            },
            error: (err) => {
              console.error(`[Buyer-Intelligence] ${err.message}`);
            },
            complete: () => {
              this.apiService
                .getCarActive({
                  vins: vin,
                  country: country,
                  access_token: accessToken,
                  latitude: carSelect.dealer.latitude,
                  longitude: carSelect.dealer.longitude,
                  radius: 100,
                  start: 0,
                  rows: 50,
                  match: "year,make,model,trim",
                  identity: "mc-buyer-intelligence",
                })
                .subscribe({
                  next: (response) => {
                    similarListings = response.listings;
                  },
                  error: (err) => {
                    console.error(`[Buyer-Intelligence] ${err.message}`);
                  },
                  complete: () => {
                    this.apiService
                      .getCarHistoryByVin(vin, {
                        access_token: accessToken,
                        rows: 100,
                        identity: "mc-buyer-intelligence",
                      })
                      .subscribe({
                        next: (response) => {
                          historyResponse = response;
                        },
                        error: (err) => {
                          console.error(`[Buyer-Intelligence] ${err.message}`);
                        },
                        complete: () => {
                          const calculated = this.calculate(
                            carSelect,
                            similarListings,
                            historyResponse,
                            price
                          );
                          subscriber.next(calculated);
                          subscriber.complete();
                        },
                      });
                  },
                });
            },
          });
      }
    );

    return processObservable;
  }

  private calculate(
    carSelect: ApiCarActiveListing,
    similarListings: ApiCarActiveListing[],
    historyResponse: ApiCarHistoryListing[],
    price
  ): calculatedResponse {
    let currentStats: number, historyStats: number, domActive: number;

    const currentPrices = similarListings
      .map((m) => m.price)
      .filter((f) => f >= 0);
    if (currentPrices.length > 0) {
      const avgPrice: number =
        currentPrices.reduce((x, y) => x + y) / currentPrices.length;

      currentStats = ((avgPrice - price) / avgPrice) * -1;
    }

    const historyPrices = historyResponse
      .map((m) => m.price)
      .filter((f) => f >= 0);
    if (historyPrices.length > 0) {
      historyStats =
        price - historyPrices.reduce((a, b) => a + b) / historyPrices.length;
    }
    domActive = carSelect.dom_active;

    return {
      currentStats: currentStats ? currentStats : 0,
      historyStats: historyStats ? historyStats : 0,
      domActive: domActive ? domActive : 0,
    };
  }
}
