import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiCarActiveListing } from '../api';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Loader } from '@googlemaps/js-api-loader';

@Injectable({
  providedIn: 'root',
})
export class SellerInfo {
  constructor(private apiService: ApiService, private http: HttpClient) {}

  process(
    vin: string,
    accessToken: string,
    google_key: string,
    country: string
    ) {
    let similarListings: ApiCarActiveListing[];

    let processObservable = new Observable((subscriber) => {
      let dealer: any,
        placeid: string,
        rating: number,
        reviews: number,
        user_ratings_total: number,
        maps_url: string;

      this.apiService
        .getCarActive({
          access_token: accessToken,
          country: country,
          vin: vin,
          identity: 'mc-seller-info',
        })
        .subscribe({
          next: (response) => {
            similarListings = response['listings'];
          },
          error: (err) => {
            console.error(`[Seller-Info] ${err.message}`);
          },
          complete: () => {
            if (similarListings.length > 0 && google_key) {
              dealer = similarListings[0].dealer;

              const loader = new Loader({
                apiKey: google_key,
                libraries: ['places'],
              });

              loader.load().then(() => {
                let google = window['google'];
                let el = document.createElement('div');
                let map = new google.maps.Map(el, {
                  center: { lat: 41.850033, lng: -87.6500523 },
                  zoom: 2,
                });

                let placeService = new window[
                  'google'
                ].maps.places.PlacesService(map);

                var request = {
                  query: dealer.name,
                  fields: [
                    'formatted_address',
                    'place_id',
                    'user_ratings_total',
                    'rating',
                  ],
                };

                placeService.findPlaceFromQuery(request, (result, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    placeid = result[0]['place_id'];
                    user_ratings_total = result[0]['user_ratings_total'];
                    rating = result[0]['rating'];

                    placeService.getDetails(
                      { placeId: placeid },
                      (result, status) => {
                        if (
                          status === google.maps.places.PlacesServiceStatus.OK
                        ) {
                          maps_url = result['url'];
                          reviews = result['reviews'].length;
                          subscriber.next({
                            dealer: dealer,
                            rating: rating,
                            reviews: reviews,
                            user_ratings_total: user_ratings_total,
                            maps_url: maps_url,
                          });
                          subscriber.complete();
                        }
                      }
                    );
                  }
                });
              });
            } else {
              console.error(
                `[Seller-Info] Active Listing not found for ${vin}`
              );
            }
          },
        });
    }); // processObservable end
    return processObservable;
  }
}
