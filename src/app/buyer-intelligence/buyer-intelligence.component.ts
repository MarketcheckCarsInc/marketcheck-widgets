import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { BuyerIntelligence } from './buyer-intelligence';

@Component({
  selector: 'app-buyer-intelligence',
  templateUrl: './buyer-intelligence.component.html',
  styleUrls: ['./buyer-intelligence.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class BuyerIntelligenceComponent implements OnInit {
  @Input('access_token') accessToken: string;
  @Input() vin: string;
  @Input() orientation: string = 'horizontal';
  @Input() version: string = '1';
  @Input() price: string;

  displayProperties = {
    title: 'Buyer Intelligence',
    currentStats: 0,
    currentStatsText: 'N/A from Similar Listing Avg.',
    currentStatsState: {},

    historyStats: 0,
    historyStatsText: 'N/A from History Prices Avg.',
    historyStatsState: {},

    domActive: 'N/A',
    domActiveText: 'Days on Market',
  };

  constructor(private bi: BuyerIntelligence) {}

  ngOnInit(): void {
    if (!this.vin || !this.price || !this.accessToken) {
      throw new Error('[Buyer-Intelligence] Required params Missing.');
    }
    this.bi
      .process(this.vin, this.accessToken, parseInt(this.price))
      .subscribe(({ currentStats, historyStats, domActive }) => {
        this.displayProperties.currentStats = currentStats;
        let stateTemp = { color: '_mcw_bi_blue', arrow: '_mcw_bi_arrow_up' };
        if (currentStats < 0) {
          stateTemp.color = '_mcw_bi_green';
          stateTemp.arrow = '_mcw_bi_arrow_down';
          this.displayProperties.currentStatsText =
            'Less from Similar Listing Avg.';
        } else if (currentStats >= 0 && currentStats <= 0.03) {
          stateTemp.color = '_mcw_bi_orange';
          stateTemp.arrow = '_mcw_bi_arrow_up';
          this.displayProperties.currentStatsText =
            'Increased from Similar Listing Avg.';
        } else if (currentStats > 0.03) {
          stateTemp.color = '_mcw_bi_red';
          stateTemp.arrow = '_mcw_bi_arrow_up';
          this.displayProperties.currentStatsText =
            'Increased from Similar Listing Avg.';
        }
        this.displayProperties.currentStatsState = this.getStateFormatted(
          stateTemp
        );

        this.displayProperties.historyStats = historyStats;
        stateTemp = { color: '_mcw_bi_blue', arrow: '_mcw_bi_arrow_up' };
        if (historyStats <= 0) {
          stateTemp.color = '_mcw_bi_green';
          stateTemp.arrow = '_mcw_bi_arrow_down';
          this.displayProperties.historyStatsText =
            'Reduced from History Prices Avg.';
        } else if (historyStats > 0) {
          stateTemp.color = '_mcw_bi_red';
          stateTemp.arrow = '_mcw_bi_arrow_up';
          this.displayProperties.historyStatsText =
            'Increased from History Prices Avg.';
        }
        this.displayProperties.historyStatsState = this.getStateFormatted(
          stateTemp
        );

        this.displayProperties.domActive = domActive.toString();
      });
  }

  getStateFormatted(state) {
    const ret = {};
    ret[state.color] = true;
    ret[state.arrow] = true;
    return ret;
  }
}
