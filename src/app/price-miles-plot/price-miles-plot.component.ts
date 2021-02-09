import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { ApiCarActiveListing } from "../api";
import { ApiService } from "../api.service";
import { Chart } from "chart.js";
import { Observable } from "rxjs";

@Component({
  selector: "app-price-miles-plot",
  templateUrl: "./price-miles-plot.component.html",
  styleUrls: ["./price-miles-plot.component.css"],
  encapsulation: ViewEncapsulation.Emulated,
})
export class PriceMilesPlotComponent implements OnInit, AfterViewInit {
  @ViewChild("canvas") canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild("nationalAvgLegend") natLeg: ElementRef<HTMLSpanElement>;
  @ViewChild("similarCarLegend") simLLeg: ElementRef<HTMLSpanElement>;
  @ViewChild("thisCarLegend") thisCarLeg: ElementRef<HTMLSpanElement>;

  @Input("access_token") accessToken: string;
  @Input() vin: string;
  @Input() miles: string;
  @Input() price: string;
  @Input() match: string = "year,make,model";
  @Input() location: string;
  @Input("car_type") carType: string;
  @Input() version: string = "1";
  @Input("max_similar_listings") maxSimilarListing: string = "50";
  @Input("grid_lines") gridLines: string = '{"x": true, "y": true}';
  @Input() colors: string =
    '{"national_avg": "#96f", "similar_cars": "#4dc9f6", "this_car": "#f67019"}';
  similarListingsSet = [];
  nationalAvg = [];

  loaded = false;

  chart;
  datasets = {
    thiscar: {},
    nationalavg: {},
    similarcars: {},
  };
  constructor(private apiService: ApiService, private renderer: Renderer2) {}
  ngOnInit(): void {}

  setLegendColors() {
    this.renderer.setStyle(
      this.natLeg.nativeElement,
      "color",
      this.colors["national_avg"]
    );
    this.renderer.setStyle(
      this.simLLeg.nativeElement,
      "color",
      this.colors["similar_cars"]
    );
    this.renderer.setStyle(
      this.thisCarLeg.nativeElement,
      "color",
      this.colors["this_car"]
    );
  }
  ngAfterViewInit(): void {
    this.colors = JSON.parse(this.colors);
    this.setLegendColors();
    if (!this.accessToken || !this.vin || !this.price || !this.miles) {
      throw new Error("[Price-Miles-Plot] Required params Missing.");
    }

    let params = {
      vins: this.vin,
      access_token: this.accessToken,
      rows: 50,
      match: this.match,
      identity: "mc-price-miles-plot",
    };
    if (this.location) {
      params = Object.assign(params, JSON.parse(this.location));
    }
    if (this.carType) {
      params["car_type"] = this.carType;
    }
    const iterations = Math.ceil(parseInt(this.maxSimilarListing) / 50);

    let similarListings$ = new Observable<ApiCarActiveListing[]>(
      (subscriber) => {
        for (
          let i = 1;
          i <= iterations &&
          this.similarListingsSet.length <= parseInt(this.maxSimilarListing);
          i++
        ) {
          params["start"] = (i - 1) * 50;

          this.apiService.getCarActive(params).subscribe({
            next: (response) => {
              subscriber.next(response.listings);
              const intervalId = setInterval(() => {
                if (
                  response.listings.length < 50 &&
                  this.similarListingsSet.length ===
                    parseInt(response.num_found)
                ) {
                  clearInterval(intervalId);
                  subscriber.complete();
                }
              }, 100);
            },
            error: (err) => {
              console.error(`[Price-Miles-Plot] ${err.message}`);
            },
            complete: () => {
              if (i == iterations) {
                const intervalId = setInterval(() => {
                  if (
                    this.similarListingsSet.length ===
                    parseInt(this.maxSimilarListing)
                  ) {
                    subscriber.complete();
                    clearInterval(intervalId);
                  }
                }, 100);
              }
            },
          });
        }
      }
    );
    similarListings$.subscribe({
      next: (response) => {
        let formatted = response.map((entry) => {
          return { x: entry.miles, y: entry.price, r: 3 };
        });
        this.similarListingsSet = this.similarListingsSet.concat(formatted);
      },
      error: (err) => {
        console.error(`[Price-Miles-Plot] ${err.message}`);
      },
      complete: () => {
        params.rows = 0;
        delete params["start"];
        params["stats"] = "price,miles";
        if (this.location) {
          delete params["radius"];
          delete params["latitude"];
          delete params["longitude"];
          delete params["city"];
          delete params["state"];
          delete params["zip"];
        }
        this.apiService.getCarActive(params).subscribe({
          next: (res) => {
            this.nationalAvg.push({
              x: res.stats["miles"]["mean"],
              y: res.stats["price"]["mean"],
              r: 6,
            });
          },
          error: (err) => {
            console.error(`[Price-Miles-Plot] ${err.message}`);
          },
          complete: () => {
            this.initChart();
          },
        });
      },
    });
  }

  initChart() {
    this.similarListingsSet = this.similarListingsSet.filter((entry) =>
      entry.x == undefined || entry.y == undefined ? false : true
    );
    this.loaded = true;

    this.gridLines = JSON.parse(this.gridLines);
    let ctx = this.canvas.nativeElement.getContext("2d");

    this.datasets.thiscar = {
      id: "thiscar",
      label: `this Car ${this.vin}`,
      data: [{ x: this.miles, y: this.price, r: 6 }],
      backgroundColor: this.colors["this_car"] || "#f67019",
      borderColor: this.colors["this_car"] || "#f67019",
      hoverBackgroundColor: this.colors["this_car"] || "#f67019",
      hoverBorderColor: this.colors["this_car"] || "#f67019",
    };
    this.datasets.nationalavg = {
      id: "nationalavg",
      label: "National Average",
      data: this.nationalAvg,
      backgroundColor: this.colors["national_avg"] || "#96f",
      borderColor: this.colors["national_avg"] || "#96f",
      hoverBackgroundColor: this.colors["national_avg"] || "#96f",
      hoverBorderColor: this.colors["national_avg"] || "#96f",
    };

    this.datasets.similarcars = {
      id: "similarcars",
      label: `${this.similarListingsSet.length} Similar Cars`,
      data: this.similarListingsSet,
      backgroundColor: this.colors["similar_cars"] || "#4dc9f6",
      borderColor: this.colors["similar_cars"] || "#4dc9f6",
      hoverBackgroundColor: this.colors["similar_cars"] || "#4dc9f6",
      hoverBorderColor: this.colors["similar_cars"] || "#4dc9f6",
    };
    this.chart = new Chart(ctx, {
      type: "bubble",
      data: {
        datasets: [
          this.datasets.thiscar,
          this.datasets.nationalavg,
          this.datasets.similarcars,
        ],
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: function (t, d) {
              return `Price: ${t.yLabel}, Miles: ${t.xLabel}`;
            },
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: { display: this.gridLines["x"] },
              scaleLabel: { display: true, labelString: "Miles" },
            },
          ],
          yAxes: [
            {
              gridLines: { display: this.gridLines["y"] },
              scaleLabel: { display: true, labelString: "Price" },
            },
          ],
        },
      },
    });
  }

  updateChart(el: HTMLSpanElement, id) {
    if (!this.loaded) {
      return;
    }
    try {
      el.classList.toggle("strike");
      this.chart.data.datasets.map((e) => e.id).indexOf(id) === -1
        ? this.chart.data.datasets.push(this.datasets[id])(this.chart.update())
        : (this.chart.data.datasets = this.chart.data.datasets.filter(
            (e) => e.id !== id
          ))(this.chart.update());
    } catch (error) {}
  }
}
