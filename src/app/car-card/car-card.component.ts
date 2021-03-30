import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiCarActiveListing } from '../api';

@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class CarCardComponent implements OnInit {
  @Input('access_token') accessToken: any;
  @Input() vin: string;
  @Input() dealer: string;
  @Input() country: string = 'US';

  @Input('show_more_button') showMoreButton: string = 'true';
  @Input('show_more_href') showMoreHref: string = '#';
  @Input('show_more_text') showMoreText: String = 'VIEW';
  @Input() version: string = '1';
  displayProperties = {
    miles: 'N/A',
    name: 'N/A',
    price: 0,
    city: 'N/A',
    state: 'N/A',
    counter: 0,
    photo_links: [],
    len_photo_links: 0,
    inv_type: 'N/A',
  };
  similarListings: ApiCarActiveListing[];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    if (!this.accessToken || !this.vin) {
      throw new Error('[Car-Card] Required params missing.');
    }
    let req_params = {
      vin: this.vin,
      country: this.country,
      access_token: this.accessToken,
      rows: 1,
      identity: 'mc-car-card',
    };
    if ((this.dealer && this.dealer !== 'null') || this.dealer !== null) {
      req_params['source'] = this.dealer;
    }

    this.apiService.getCarActive(req_params).subscribe({
      next: (response) => {
        this.similarListings = response.listings;
      },
      error: (err) => {
        console.error(`[Car-Card] ${err.message}`);
      },
      complete: () => {
        if (this.similarListings.length > 0) {
          this.displayProperties.miles = this.similarListings[0].miles
            ? this.similarListings[0].miles.toString()
            : 'N/A';
          this.displayProperties.name = this.similarListings[0].heading
            ? this.similarListings[0].heading
            : 'N/A';
          this.displayProperties.price = this.similarListings[0].price
            ? this.similarListings[0].price
            : 0;
          this.displayProperties.city = this.similarListings[0].dealer.city
            ? this.similarListings[0].dealer.city
            : 'N/A';
          this.displayProperties.state = this.similarListings[0].dealer.state
            ? this.similarListings[0].dealer.state
            : 'N/A';
          this.displayProperties.photo_links = this.similarListings[0].media
            .photo_links
            ? this.similarListings[0].media.photo_links
            : [];
          this.displayProperties.len_photo_links = this.similarListings[0].media
            .photo_links
            ? this.similarListings[0].media.photo_links.length
            : 0;
          this.displayProperties.inv_type = this.similarListings[0]
            .inventory_type
            ? this.similarListings[0].inventory_type
            : 'N/A';
        }
      },
    });
  }
  showNextImage() {
    if (
      this.displayProperties.counter <
      this.displayProperties.len_photo_links - 1
    ) {
      this.displayProperties.counter += 1;
    }
  }

  showPreviousImage() {
    if (this.displayProperties.counter >= 1) {
      this.displayProperties.counter -= 1;
    }
  }
}
