import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  ViewEncapsulation,
  QueryList,
  Renderer2,
} from "@angular/core";
import { ApiService } from "../api.service";
import { ApiCarActiveListing } from "../api";
import { delay } from "rxjs/operators";

@Component({
  selector: "app-similar-cars",
  templateUrl: "./similar-cars.component.html",
  styleUrls: ["./similar-cars.component.css"],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SimilarCarsComponent implements OnInit, AfterViewInit {
  @ViewChild("container") container: ElementRef<HTMLElement>;
  @ViewChildren("slide") slideList: QueryList<any>;

  @Input("access_token") accessToken: any;
  @Input() vin: string;
  @Input("vdp_root") vdp_root: string;
  @Input() target: string = "_blank";
  @Input("car_type") car_type: string;
  @Input() location: string;
  @Input() rows: string = "10";
  @Input() match: string = "year,make,model,trim";
  @Input() version: string = "1";

  similar_listings: ApiCarActiveListing[] = [];
  displayProperties = {
    footerBtnTitle: "Show Details",
  };
  constructor(private apiService: ApiService, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (
      !this.vin ||
      !this.accessToken ||
      !this.location ||
      !this.vdp_root ||
      !this.car_type
    ) {
      throw new Error("[Similar-Cars] Required params Missing.");
    }

    const params = Object.assign(
      {
        vins: this.vin,
        access_token: this.accessToken,
        car_type: this.car_type,
        rows: this.rows,
        match: this.match,
        identity: "mc-similar-cars",
      },
      JSON.parse(this.location)
    );

    this.apiService.getCarActive(params).subscribe({
      next: (response) => {
        this.similar_listings = response["listings"];
      },
      error: (err) => {
        console.error(`[Similar-cars] ${err.message}`);
        this.renderer.setStyle(
          this.container.nativeElement,
          "text-align",
          "center"
        );
        this.renderer.setStyle(
          this.container.nativeElement,
          "font-size",
          "1.5rem"
        );
        this.container.nativeElement.innerText =
          "Error in loading Similar Listings.";
      },
    });
  }

  ngAfterViewInit() {
    this.slideList.changes.pipe(delay(0)).subscribe((t) => {
      this.sliderInit();
    });
  }

  containerWidth: number = 0;
  slides: ElementRef[];
  slideWidth: number;
  sliderMargin: number = 0;
  initialMargin: number = 0;
  slideDistance: number = 0;
  nextClicks: number = 0;
  nextClicksMax: number;
  numSlides: number;
  totalWidth: number = 0;

  sliderInit() {
    this.containerWidth = this.container.nativeElement.offsetWidth;
    this.slides = Array.from(this.slideList);

    this.slideWidth = this.slides[0].nativeElement.offsetWidth;

    this.numSlides = Math.floor((this.containerWidth / this.slideWidth) * 0.9);
    this.initialMargin =
      (this.containerWidth - this.numSlides * this.slideWidth) /
      (this.numSlides * 2);

    this.slides.forEach((el) => {
      this.renderer.setStyle(
        el.nativeElement,
        "marginLeft",
        this.initialMargin + "px"
      );
      this.renderer.setStyle(
        el.nativeElement,
        "marginRight",
        this.initialMargin + "px"
      );
      this.totalWidth += this.slideWidth + 2 * this.initialMargin;
    });

    this.slideDistance = this.containerWidth;

    this.renderer.setStyle(
      this.container.nativeElement,
      "width",
      this.totalWidth + 2 + "px"
    );

    this.nextClicksMax = Math.ceil(this.slides.length / this.numSlides) - 1;
  }

  next() {
    this.nextClicks += 1;
    const dist = this.sliderMargin - this.slideDistance;
    this.renderer.setStyle(
      this.container.nativeElement,
      "marginLeft",
      dist + "px"
    );
    this.sliderMargin = dist;
  }

  prev() {
    this.nextClicks -= 1;
    const dist = this.sliderMargin + this.slideDistance;
    this.renderer.setStyle(
      this.container.nativeElement,
      "marginLeft",
      dist + "px"
    );
    this.sliderMargin = dist;
  }
}
