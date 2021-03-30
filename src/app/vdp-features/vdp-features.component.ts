import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { VdpFeaturesSection } from './vdp-features-section';

@Component({
  selector: 'app-vdp-features',
  templateUrl: './vdp-features.component.html',
  styleUrls: ['./vdp-features.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class VdpFeaturesComponent implements OnInit {
  @Input() vin: string;
  @Input('access_token') accessToken: string;
  @Input() title: string = 'Features';
  @Input() version: string = '1';
  @Input() country: string = 'US';

  listingId: any;
  features: string[];
  features_size: any;
  show = false;

  constructor(private vdp: VdpFeaturesSection) {}

  ngOnInit(): void {
    if (!this.vin || !this.accessToken) {
      throw new Error('[Car-Features] Required params Missing.');
    }
    this.vdp.process(this.vin, this.accessToken, this.country).subscribe(
      ({ features }) => {
        this.features = features;
      },
      (err) => {
        console.error(`[Car-Features] ${err.message}`);
      }
    );
  }

  showMore() {
    this.show = !this.show;
  }
}
