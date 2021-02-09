import { Component, Input, OnInit } from "@angular/core";
import { ApiCarVINDecoderEpi } from "../api";
import { ApiService } from "../api.service";

@Component({
  selector: "app-car-safety-breakup",
  templateUrl: "./car-safety-breakup.component.html",
  styleUrls: ["./car-safety-breakup.component.css"],
})
export class CarSafetyBreakupComponent implements OnInit {
  @Input("access_token") accessToken: string;
  @Input() vin: string;
  @Input() version: string = "1";

  constructor(private apiService: ApiService) {}

  displayProperties = {
    overall: 0,
    overallClsArr: [],
    rollOver: 0,
    rollOverClsArr: [],

    sideImpact: 0,
    sideImpactClsArr: [],

    frontImpact: 0,
    frontImpactClsArr: [],
  };
  vinDecoderResponse: ApiCarVINDecoderEpi;

  ngOnInit(): void {
    if (!this.accessToken || !this.vin) {
      throw new Error(`[Car-Safety-Breakup] Required params Missing.`);
    }

    this.apiService
      .decodeCarByVinAdvanced(this.vin, {
        access_token: this.accessToken,
        identity: "mc-car-safety-breakup",
      })
      .subscribe({
        next: (response) => {
          this.vinDecoderResponse = response;
        },
        error: (err) => {
          console.error(`[Car-Safety-Breakup] ${err.message}`);
        },
        complete: () => {
          this.processResponse();
        },
      });
  }

  processResponse() {
    if (this.vinDecoderResponse.vINDataSources.length > 0) {
      this.vinDecoderResponse.vINDataSources.map((a) => {
        a.vehicleInfo.map((b) => {
          b.installedEquipment.map((c) => {
            if (c.attribute === "rollover rating" && c.location === "NHTSA") {
              this.displayProperties.rollOver = parseInt(c.value);
            } else if (c.attribute === "overall" && c.location === "NHTSA") {
              this.displayProperties.overall = parseInt(c.value);
            } else if (
              c.attribute === "side impact" &&
              c.location === "NHTSA"
            ) {
              this.displayProperties.sideImpact = parseInt(c.value);
            } else if (
              c.attribute === "frontal crash rating" &&
              c.location === "NHTSA"
            ) {
              this.displayProperties.frontImpact = parseInt(c.value);
            }
          });
        });
      });

      this.displayProperties.rollOverClsArr = this.getStarClassesInSequence(
        this.displayProperties.rollOver
      );
      this.displayProperties.overallClsArr = this.getStarClassesInSequence(
        this.displayProperties.overall
      );
      this.displayProperties.sideImpactClsArr = this.getStarClassesInSequence(
        this.displayProperties.sideImpact
      );
      this.displayProperties.frontImpactClsArr = this.getStarClassesInSequence(
        this.displayProperties.frontImpact
      );
    }
  }

  getStarClassesInSequence(rating: number) {
    let classes = [];
    for (let i = 1; i <= 5; i++) {
      const val = rating - i;
      if (val >= 0) {
        classes.push("_mcw_csb_star");
      } else if (val <= -1) {
        classes.push("_mcw_csb_star_border");
      } else if (val < 0 && val > -1) {
        classes.push("_mcw_csb_star_half");
      }
    }
    return classes;
  }
}
