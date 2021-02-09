import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiPopularCar } from '../api';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-popular-cars',
  templateUrl: './popular-cars.component.html',
  styleUrls: ['./popular-cars.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class PopularCarsComponent implements OnInit {
  @Input('access_token') accessToken: string;
  @Input('car_type') carType: string;
  @Input() state: string;
  @Input() country: string;

  @Input('show_stats') showStats: string = 'true';
  @Input('max_rows') maxRows: string = '5';
  @Input() version: string = '1';
  @Input() clickable: string = 'false';

  constructor(private apiService: ApiService) {}

  nationwidePopularCars: ApiPopularCar[];
  statewidePopularCars: ApiPopularCar[];

  ngOnInit(): void {
    if (!this.accessToken || !this.carType || !(this.country || this.state)) {
      throw new Error('[Popular-Cars] Required params Missing.');
    }

    if (this.country) {
      this.country = this.country.toLowerCase();
      this.apiService
        .getPopularCars({
          access_token: this.accessToken,
          car_type: this.carType,
          country: this.country,
          identity: 'mc-popular-cars',
        })
        .subscribe({
          next: (response) => {
            this.nationwidePopularCars = response.splice(
              0,
              parseInt(this.maxRows)
            );
          },
          error: (err) => {
            console.error(`[Popular-Cars] ${err.message}`);
          },
          complete: () => {},
        });
    }

    if (this.state) {
      this.apiService
        .getPopularCars({
          access_token: this.accessToken,
          car_type: this.carType,
          state: this.state,
          country: this.country || 'us',
          identity: 'mc-popular-cars',
        })
        .subscribe({
          next: (res) => {
            this.statewidePopularCars = res.splice(0, parseInt(this.maxRows));
          },
          error: (err) => {
            console.error(`[Popular-Cars] ${err.message}`);
          },
          complete: () => {},
        });
    }
  }
}
