import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";
import { ApiService } from "../api.service";
import { ApiCarHistoryListing } from "../api";
import { Observable } from "rxjs";

@Component({
  selector: "app-car-history",
  templateUrl: "./car-history.component.html",
  styleUrls: ["./car-history.component.css"],
  encapsulation: ViewEncapsulation.Emulated,
})
export class CarHistoryComponent implements OnInit {
  @Input() title: string = "Car History default";
  @Input() vin: string;
  @Input("access_token") accessToken: string;
  @Input("max_rows") count: string = "10";
  @Input() version: string = "1";
  @Input() col: any = "3";
  countInt: number;
  colArr = [];
  constructor(private apiService: ApiService) {}
  historyResponse: ApiCarHistoryListing[] = [];
  Math = Math;
  ngOnInit(): void {
    if (!this.accessToken || !this.vin) {
      throw new Error("[Car-History] Required params Missing.");
    }
    this.countInt = parseInt(this.count);
    this.col = parseInt(this.col) > 3 ? 3 : parseInt(this.col);
    this.colArr = Array(parseInt(this.col))
      .fill(1)
      .map((x, i) => i);
    let req_params = {
      access_token: this.accessToken,
      page: 0,
      identity: "mc-car-history",
    };

    const iterations = Math.ceil(parseInt(this.count) / 50);

    const obs = new Observable<ApiCarHistoryListing[]>((subscriber) => {
      for (
        let i = 1;
        i <= iterations &&
        this.historyResponse.length <= Math.floor(parseInt(this.count));
        i++
      ) {
        req_params["page"] = i;

        this.apiService.getCarHistoryByVin(this.vin, req_params).subscribe({
          next: (response) => {
            subscriber.next(response);
            if (response.length < 50) {
              subscriber.complete();
            }
          },
          error: (err) => {
            console.error(`[Car-History] ${err.message}`);
          },
          complete: () => {
            if (i == iterations) {
              subscriber.complete();
            }
          },
        });
      }
    });

    obs.subscribe({
      next: (response) => {
        this.historyResponse = this.historyResponse.concat(response);
      },
      error: (err) => {
        console.error(`[Car-History] ${err.message}`);
      },
    });
  }
}
