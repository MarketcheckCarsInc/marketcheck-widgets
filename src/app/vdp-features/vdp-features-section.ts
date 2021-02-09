import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { ApiCarActiveListing, ApiListingCarResponse } from "../api";
import { Observable } from "rxjs";

interface calculatedResponse {
  features: string[];
}

@Injectable({
  providedIn: "root",
})
export class VdpFeaturesSection {
  constructor(private apiService: ApiService) {}
  process(vin: string, accessToken: string) {
    let searchResponse: ApiCarActiveListing;
    let listingResponse: ApiListingCarResponse[];

    let processObservable = new Observable<calculatedResponse>((subscriber) => {
      this.apiService
        .getCarActive({
          vin: vin,
          access_token: accessToken,
          identity: "mc-vdp-features",
        })
        .subscribe({
          next: (value) => {
            searchResponse = value.listings.shift();
          },
          error: (err) => {
            console.error(`[Car-Features] ${err.message}`);
          },
          complete: () => {
            this.apiService
              .getListingByID(searchResponse.id, {
                access_token: accessToken,
                rows: 100,
                identity: "mc-vdp-features",
              })
              .subscribe({
                next: (response) => {
                  listingResponse = response;
                },
                error: (err) => {
                  console.error(`[Car-Features] ${err.message}`);
                },
                complete: () => {
                  let calculated = this.calculate(listingResponse);
                  subscriber.next(calculated);
                  subscriber.complete();
                },
              });
          },
        });
    });
    return processObservable;
  }

  private calculate(listingResponse: ApiListingCarResponse[]) {
    let features: string[];
    let extraKeys = Object.keys(listingResponse["extra"]);
    extraKeys.map((value) => {
      if (value != "seller_comments") {
        features = [].concat(features, ...listingResponse["extra"][`${value}`]);
      }
    });
    features = features.filter((v, i, a) => a.indexOf(v) === i);
    features.shift();
    return { features };
  }
}
