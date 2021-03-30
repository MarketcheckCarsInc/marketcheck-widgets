import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ApiService } from "../api.service";
import { Chart } from "chart.js";

@Component({
  selector: "app-time-on-market",
  templateUrl: "./time-on-market.component.html",
  styleUrls: ["./time-on-market.component.css"],
  encapsulation: ViewEncapsulation.Emulated,
})
export class TimeOnMarketComponent implements OnInit, AfterViewInit {
  @ViewChild("canvas") canvas: ElementRef<HTMLCanvasElement>;

  @Input("access_token") accessToken: string;
  @Input() vin: string;
  @Input("car_type") carType: string;
  @Input() location: string;
  @Input() country: string = 'US';
  @Input() height: string;
  @Input() width: string;
  @Input() layout: string = "semi-circle";
  @Input() colors: string =
    '{"national_avg":"#FF6384", "local_avg":"#36A2EB", "curr_car":"#FFCE56"}';
  @Input() version: string = "1";
  layoutConfigs = {
    "semi-circle": {
      circumference: Math.PI,
      rotation: -1 * Math.PI,
    },
    circle: {
      circumference: 2 * Math.PI,
      rotation: -0.5 * Math.PI,
    },
  };

  displayProperties = {
    currentDOM: 0,
    localAvgDom: 0,
    natinalAvgDom: 0,
  };
  styles = {
    height: "300px",
    width: "300px",
    display: "block",
  };

  locationParsed = {};

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    let locWhitelistKeys = [
      "zip",
      "city",
      "state",
      "latitude",
      "longitude",
      "radius",
    ];
    if (!this.accessToken || !this.vin || !this.carType || !this.location) {
      throw new Error("[Time-On-Market] Required params Missing.");
    }

    this.locationParsed = JSON.parse(this.location);
    Object.keys(this.locationParsed).forEach((key) => {
      if (!locWhitelistKeys.includes(key)) {
        delete this.locationParsed[key];
      }
    });

    this.colors = JSON.parse(this.colors);

    if (this.width) {
      this.styles.width = this.width;
    }
    if (this.height) {
      this.styles.height = this.height;
    }
    if (this.layout == "semi-circle" && !this.height) {
      this.styles.height = "170px";
    }
    let params = {
      access_token: this.accessToken,
      vins: this.vin,
      country: this.country,
      rows: 0,
      stats: "dom",
      match: "year,make,model,trim",
      identity: "mc-time-on-market",
    };

    this.apiService.getCarActive(params).subscribe({
      next: (response) => {
        this.displayProperties.natinalAvgDom =
          response["stats"]["dom"]["mean"] || 0;
      },
      error: (err) => {
        console.error(`[Time-On-Market] ${err.message}`);
      },
      complete: () => {
        params = { ...params, ...this.locationParsed };
        this.apiService.getCarActive(params).subscribe({
          next: (res) => {
            this.displayProperties.localAvgDom =
              res["stats"]["dom"]["mean"] || 0;
          },
          error: (err) => {
            console.error(`[Time-On-Market] ${err.message}`);
          },
          complete: () => {
            delete params.match;
            delete params.vins;
            params["vin"] = this.vin;
            this.apiService.getCarActive(params).subscribe({
              next: (response) => {
                this.displayProperties.currentDOM =
                  response["stats"]["dom"]["max"] || 0;
              },
              error: (err) => {
                console.error(`[Time-On-Market] ${err.message}`);
              },
              complete: () => {
                this.initPlot();
              },
            });
          },
        });
      },
    });
  }

  initPlot() {
    let nearestCutoff = Math.max(...Object.values(this.displayProperties));

    var chartData = {
      datasets: [
        {
          labels: ["National Average", "Limit"],
          data: [
            parseFloat(`${this.displayProperties.natinalAvgDom}`).toFixed(2),
            parseFloat(
              `${nearestCutoff - this.displayProperties.natinalAvgDom}`
            ).toFixed(2),
          ],
          backgroundColor: [this.colors["national_avg"], "#fff"],
          hoverBackgroundColor: [this.colors["national_avg"], "#fff"],
        },
        {
          labels: ["Local Average", "Limit"],
          data: [
            parseFloat(`${this.displayProperties.localAvgDom}`).toFixed(2),
            parseFloat(
              `${nearestCutoff - this.displayProperties.localAvgDom}`
            ).toFixed(2),
          ],
          backgroundColor: [this.colors["local_avg"], "#fff"],
          hoverBackgroundColor: [this.colors["local_avg"], "#fff"],
        },
        {
          labels: [this.vin, "Limit"],
          data: [
            this.displayProperties.currentDOM,
            parseFloat(
              `${nearestCutoff - this.displayProperties.currentDOM}`
            ).toFixed(2),
          ],
          backgroundColor: [this.colors["curr_car"], "#fff"],
          hoverBackgroundColor: [this.colors["curr_car"], "#fff"],
        },
      ],
    };
    var that = this;
    let canvasCtx = this.canvas.nativeElement.getContext("2d");

    let chart = new Chart(canvasCtx, {
      type: "pie",
      data: chartData,
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        cutoutPercentage: "69",
        tooltips: {
          callbacks: {
            label: (t, d) => {
              const idx = t["datasetIndex"];
              const datapointIdx = t["index"];
              const label =
                d["datasets"][idx]["labels"][datapointIdx] +
                ` ${d["datasets"][idx]["data"][datapointIdx]} days`;
              return label;
            },
          },
        },
        ...this.layoutConfigs[this.layout],
      },
      plugins: {
        afterDatasetsDraw: (chart) => {
          var ctx = chart.chart.ctx;
          var height = chart.chart.height;
          var width = chart.chart.width;

          ctx.font = "14px sans-serif";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#333";

          var currentText = `   This car  ${that.displayProperties.currentDOM} days`;
          var x = Math.round((width - ctx.measureText(currentText).width) / 2);
          var y = height / 1.7;
          if (that.layout === "circle") {
            y = height / 2.4;
            ctx.font = "15px sans-serif";
            currentText = `  This car  ${that.displayProperties.currentDOM} days`;
          }
          ctx.fillText(currentText, x, y);

          var localAvgText = `Local Avg. ${that.displayProperties.localAvgDom} days`;
          var x = Math.round((width - ctx.measureText(localAvgText).width) / 2);
          var y = height / 1.4;
          if (that.layout === "circle") {
            y = height / 2.0;
          }
          ctx.fillText(localAvgText, x, y);

          var nationalAvgText = `National Avg. ${that.displayProperties.natinalAvgDom} days`;
          var x = Math.round(
            (width - ctx.measureText(nationalAvgText).width) / 2
          );
          var y = height / 1.2;
          if (that.layout === "circle") {
            y = height / 1.7;
          }
          ctx.fillText(nationalAvgText, x, y);
        },
      },
    });
  }
}
