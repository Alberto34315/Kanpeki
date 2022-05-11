import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styles: [],
})
export class ChartComponent implements OnInit,AfterViewInit {
  @Input('data') data!: ChartConfiguration['data'];
  @Input('options') options!: ChartConfiguration['options'];
  @Input('type') type!: ChartType;
  
   @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor() {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
    this.chart?.chart?.update()
    },700);
  }
  
}
