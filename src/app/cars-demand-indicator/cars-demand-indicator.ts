import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarsDemandIndicator {
  constructor(private apiService: ApiService) {}

  process(
    vin: string,
    accessToken: string,
    latitude: number,
    longitude: number,
    radius: number,
    debug: boolean
  ) {
    let carsDemandResponse: any = [];

    let processObservable = new Observable((subscriber) => {
      this.apiService
        .getCarMDS({
          vin: vin,
          access_token: accessToken,
          latitude: latitude,
          longitude: longitude,
          radius: radius,
          debug: debug,
          identity: 'mc-car-demand',
        })
        .subscribe({
          next: (response) => {
            carsDemandResponse = response;
          },
          error: (err) => {
            console.error(`[Car-Demand-Indicator] ${err.message}`);
          },
          complete: () => {
            let mds: any;
            let available_units: any;
            let sold_units: any;

            if (carsDemandResponse) {
              mds = carsDemandResponse.mds;
              available_units = carsDemandResponse.total_active_cars_for_ymmt;
              sold_units = carsDemandResponse.total_cars_sold_in_last_45_days;
            } else {
              mds = 'NA';
              available_units = 'NA';
              sold_units = 'NA';
            }
            subscriber.next({
              mds: mds,
              available_units: available_units,
              sold_units: sold_units,
            });
            subscriber.complete();
          },
        });
    });
    return processObservable;
  }
}
