import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styles: [
  ]
})
export class ChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input('data') data!:  ChartConfiguration['data'];
  @Input('options') options!:  ChartConfiguration['options'];
  @Input('type') type!:  ChartType;
  constructor() { }

  ngOnInit(): void {
    this.chart?.chart?.update()
  }

}
