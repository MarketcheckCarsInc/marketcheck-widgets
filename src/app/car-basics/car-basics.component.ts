import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-car-basics',
  templateUrl: './car-basics.component.html',
  styleUrls: ['./car-basics.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class CarBasicsComponent implements OnInit {
  @Input('access_token') accessToken: any;
  @Input() vin: string;
  @Input() title: string = 'Vehicle Basics';
  @Input() version: string = '1';
  @Input() country: string = 'US';

  displayproperties = {
    vin: 'N/A',
    miles: 'N/A',
    'inventory type': 'N/A',
    'stock no': 'N/A',
    trim: 'N/A',
    engine: 'N/A',
    bodytype: 'N/A',
    drivetrain: 'N/A',
    'exterior color': 'N/A',
    'interior color': 'N/A',
  };
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    if (!this.accessToken || !this.vin) {
      throw new Error('[Car-Basics] Required params Missing.');
    }
    this.apiService
      .getCarActive({
        vin: this.vin,
        country: this.country,
        access_token: this.accessToken,
        identity: 'mc-car-basics',
      })
      .subscribe({
        next: (response) => {
          if (response.listings.length > 0) {
            this.displayproperties.vin = response.listings[0]['vin'];
            this.displayproperties.miles = response.listings[0]['miles']
              ? response.listings[0]['miles'].toString()
              : 'N/A';
            this.displayproperties.engine =
              response.listings[0]['build']['engine'];
            this.displayproperties.drivetrain =
              response.listings[0]['build']['drivetrain'];
            this.displayproperties.bodytype =
              response.listings[0]['build']['body_type'];
            this.displayproperties['stock no'] = response.listings[0][
              'stock_no'
            ]
              ? response.listings[0]['stock_no'].toString()
              : 'N/A';
            this.displayproperties['inventory type'] =
              response.listings[0]['inventory_type'];
            this.displayproperties.trim = response.listings[0]['build']['trim'];
            this.displayproperties['interior color'] =
              response.listings[0]['interior_color'];
            this.displayproperties['exterior color'] =
              response.listings[0]['exterior_color'];
          }
        },
        error: (err) => {
          console.error(`[Car-Basics] ${err.message}`);
        },
      });
  }
}
