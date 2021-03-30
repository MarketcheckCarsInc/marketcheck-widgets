import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
  Renderer2,
} from "@angular/core";
import { ApiCarVINDecoder } from "../api";
import { ApiService } from "../api.service";

@Component({
  selector: "app-fuel-economy",
  templateUrl: "./fuel-economy.component.html",
  styleUrls: ["./fuel-economy.component.css"],
  encapsulation: ViewEncapsulation.Emulated,
})
export class FuelEconomyComponent implements OnInit, AfterViewInit {
  @ViewChild("canvas") canvas: ElementRef<HTMLCanvasElement>;

  @Input("access_token") accessToken: string;
  @Input() vin: string;
  @Input() layout: string = "droplet";
  @Input() colors: string =
    '{"highway_mpg": "#193A6F", "city_mpg": "#F98125", "text" : "#fff"}';
  @Input("show_title") showTitle: string = "true";
  @Input() version: string = "1";

  constructor(private apiService: ApiService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.colors = JSON.parse(this.colors);
  }

  ngAfterViewInit(): void {
    if (!this.accessToken || !this.vin) {
      throw new Error("[Fuel-Economy] Required params Missing.");
    }
    if (this.layout === "circle") {
      this.renderer.setAttribute(this.canvas.nativeElement, "width", "240");
      this.renderer.setAttribute(this.canvas.nativeElement, "height", "240");
    }
    this.init();
  }

  init() {
    let data: ApiCarVINDecoder;

    this.apiService
      .decodeCarByVin(this.vin, {
        access_token: this.accessToken,
        identity: "mc-fuel-economy",
      })
      .subscribe({
        next: (response) => {
          data = response;
        },
        error: (err) => {
          console.error(`[Fuel-Economy] ${err.message}`);
        },
        complete: () => {
          this.renderWidget(data);
        },
      });
  }

  renderWidget(data: ApiCarVINDecoder) {
    let ctx = this.canvas.nativeElement.getContext("2d");
    const width = parseInt(this.canvas.nativeElement.getAttribute("width"));
    const height = parseInt(this.canvas.nativeElement.getAttribute("height"));

    if (this.showTitle.toLowerCase() === "true") {
      this.renderer.setAttribute(
        this.canvas.nativeElement,
        "height",
        `${height + 40}`
      );
    }
    if (this.layout === "droplet") {
      let path1 = new Path2D();
      path1.moveTo(144 - 50, 200);
      path1.bezierCurveTo(-77 - 50, -28, 350 - 50, -45, 144 - 50, 200);
      ctx.fillStyle = this.colors["highway_mpg"];
      ctx.fill(path1);

      let path2 = new Path2D();
      path2.moveTo(144 + 120, 200);
      path2.bezierCurveTo(-77 + 120, -28, 350 + 120, -45, 144 + 120, 200);

      ctx.fillStyle = this.colors["city_mpg"];
      ctx.fill(path2);

      // populate data
      ctx.fillStyle = this.colors["text"];
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = "bold 52px sans-serif";
      ctx.fillText(
        data.highway_mpg ? data.highway_mpg.toString() : 'N/A',
        65,
        85
      );
      ctx.fillText(
        data.city_mpg ? data.city_mpg.toString() : 'N/A',
        65 + 47 + 120,
        85
      );

      ctx.font = "bold 16px sans-serif";
      ctx.fillText("MPG", 75, 120);
      ctx.fillText("MPG", 73 + 49 + 120, 120);

      ctx.font = "15px sans-serif";
      ctx.fillText("HIGHWAY", 58, 141);
      ctx.fillText("CITY", 62 + 59 + 120, 141);

      // title text
      if (this.showTitle.toLowerCase() === "true") {
        ctx.fillStyle = "#333";
        ctx.font = '24px "Rubik", "sans-serif"';
        ctx.fillText("Fuel Economy", 100, 230);
        ctx.font = '12px "Rubik", "sans-serif"';
        ctx.fillText(this.vin, 112, 250);
      }
    } else if (this.layout === "circle") {
      let path1 = new Path2D();

      path1.ellipse(120, 120, 95, 100, Math.PI, 0, -3.14159);

      ctx.fillStyle = this.colors["highway_mpg"];
      ctx.fill(path1);
      let path2 = new Path2D();

      path2.ellipse(120, 120, 95, 100, 0, 0, -3.14159);

      ctx.fillStyle = this.colors["city_mpg"];
      ctx.fill(path2);

      // populate data
      ctx.fillStyle = this.colors["text"];
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = "bold 52px sans-serif";
      ctx.fillText(
        data.highway_mpg ? data.highway_mpg.toString() : 'N/A',
        90,
        60
      );
      ctx.fillText(
        data.city_mpg ? data.city_mpg.toString() : 'N/A',
        90,
        60 + 95
      );

      ctx.font = "16px sans-serif";
      ctx.fillText("HIGHWAY MPG", 65, 60 + 40);
      ctx.fillText("CITY MPG", 80, 60 + 36 + 95);

      //title text
      if (this.showTitle.toLowerCase() === "true") {
        ctx.fillStyle = "#333";
        ctx.font = '24px "Rubik", "sans-serif"';
        ctx.fillText("Fuel Economy", 45, 250);
        ctx.font = '12px "Rubik", "sans-serif"';
        ctx.fillText(this.vin, 60, 270);
      }
    }
  }
}
