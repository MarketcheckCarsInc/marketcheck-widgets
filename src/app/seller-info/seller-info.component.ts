import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { SellerInfo } from './seller-info';

@Component({
  selector: 'app-seller-info',
  templateUrl: './seller-info.component.html',
  styleUrls: ['./seller-info.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SellerInfoComponent implements OnInit {
  @Input() version: string = '1';
  @Input() access_token: string;
  @Input() vin: string;
  @Input() google_key: string;

  displayProperties = {
    name: 'N/A',
    city: 'N/A',
    state: 'N/A',
    street: 'N/A',
    zip: '',
    country: '',
    phone: 'N/A',
    rating: 0,
    reviews: 0,
    domain: 'N/A',
    user_ratings_total: 0,
    maps_url: '#',
    custom: [],
  };

  constructor(private si: SellerInfo) {}

  ngOnInit(): void {
    if (!this.vin || !this.access_token || !this.google_key) {
      throw new Error(`[Seller-Info] Required params Missing.`);
    }
    this.si
      .process(this.vin, this.access_token, this.google_key)
      .subscribe(
        ({ dealer, rating, reviews, user_ratings_total, maps_url }) => {
          this.displayProperties.name = dealer.name;
          this.displayProperties.domain = dealer.website;
          this.displayProperties.city = dealer.city;
          this.displayProperties.state = dealer.state;
          this.displayProperties.rating = rating;
          this.displayProperties.reviews = reviews;
          this.displayProperties.user_ratings_total = user_ratings_total;
          this.displayProperties.maps_url = maps_url;
          this.displayProperties.street = dealer.street;
          this.displayProperties.zip = dealer.zip;
          this.displayProperties.country = dealer.country;
          this.displayProperties.phone = dealer.phone;

          for (let i = 1; i <= 5; i++) {
            let val = rating - i;
            if (val >= 0) {
              this.displayProperties.custom.push('_mcw_si_star');
            } else if (val <= -1) {
              this.displayProperties.custom.push('_mcw_si_star_border');
            } else if (val < 0 && val > -1) {
              this.displayProperties.custom.push('_mcw_si_star_half');
            }
          }
        }
      );
  }
}
