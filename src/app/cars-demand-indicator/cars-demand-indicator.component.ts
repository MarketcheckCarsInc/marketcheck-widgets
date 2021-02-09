import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { CarsDemandIndicator } from './cars-demand-indicator';

@Component({
  selector: 'app-cars-demand-indicator',
  templateUrl: './cars-demand-indicator.component.html',
  styleUrls: ['./cars-demand-indicator.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class CarsDemandIndicatorComponent implements OnInit {
  @Input('access_token') accessToken: string;
  @Input() vin: string;
  @Input() location: string;

  @Input() orientation: string = 'horizontal';
  @Input() version: string = '1';

  displayProperties = {
    mds: 0,
    inv_count: 0,
    sold_count: 0,
  };

  constructor(private cdi: CarsDemandIndicator) {}

  ngOnInit(): void {
    if (
      !this.accessToken ||
      !this.vin ||
      !this.location ||
      !JSON.parse(this.location)['latitude'] ||
      !JSON.parse(this.location)['longitude'] ||
      !JSON.parse(this.location)['radius']
    ) {
      throw new Error('[Car-Demand-Indicator] Required params missing.');
    }
    this.location = JSON.parse(this.location);
    this.cdi
      .process(
        this.vin,
        this.accessToken,
        this.location['latitude'],
        this.location['longitude'],
        this.location['radius'],
        true
      )
      .subscribe(
        (data) => {
          this.displayProperties.mds = data['mds'];
          this.displayProperties.inv_count = data['available_units'];
          this.displayProperties.sold_count = data['sold_units'];
        },
        (err) => {
          console.error(`[Car-Demand-Indicator] ${err.message}`);
        }
      );
  }
}
