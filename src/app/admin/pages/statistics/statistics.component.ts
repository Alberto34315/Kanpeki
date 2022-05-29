import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ConnectionService } from '../../services/connection.service';
import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { finalize, tap } from 'rxjs';
import { ResponseResultDTO } from 'src/app/models/response/responseResultDTO';
registerLocaleData(localeES, 'es');

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styles: [
  ]
})
export class StatisticsComponent implements OnInit {
  public load: boolean = false;
  public score: number[] = []
  public date: string[] = []
  public footerTooltip: string = ""
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Media de aprobados/Categoría',
        fill: 'origin',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#eb6864',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(235, 104, 100,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 2.5,
        pointHitRadius: 10,
        backgroundColor: 'rgba(235, 104, 100,0.4)',
        borderColor: '#eb6864',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        spanGaps: false
      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      xAxes:
      {
        beginAtZero: true,
        ticks: {
          autoSkip: false
        }
      },
      yAxes:
      {
        beginAtZero: true,
        ticks: {
          autoSkip: false
        },
        stacked: true,
        suggestedMax: 10,
      }

    },

    plugins: {
      legend: {
        display: true,
      },
    }
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  //--------------------------------------------------------------------------------------------
  public pieChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  @ViewChild(BaseChartDirective) chartPie?: BaseChartDirective;

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Número de exámenes por categoría',
        position: 'top'
      },
      legend: {
        display: true,
        position: 'bottom',
      }
    }
  };

  public pieChartType: ChartType = 'pie';

  //---------------------------------------------------------------------------
  public listCategories: ResponseCategoryDTO[] = []

  public usersStatics!: any[]
  constructor(private connectionS: ConnectionService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.connectionS.getCategories()
      .subscribe(res => {
        this.listCategories = res
        this.connectionS.getResultsCustomData()
          .pipe(tap({
            next: (res) => {
              this.usersStatics=[]
              this.load = true              
              this.usersStatics = res
              res.forEach((element, i) => {
                this.lineChartData.datasets.forEach((value) => {
                  value.data.unshift(element.avgResults)
                })
                this.pieChartData.datasets.forEach((value) => {
                  value.data.unshift(element.numResults)
                })
                this.pieChartData.labels?.unshift(this.returnNameCategory(element.categoryId))
                this.lineChartData.labels?.unshift(this.returnNameCategory(element.categoryId))
                this.chart?.chart?.update()
                this.chartPie?.chart?.update()
              });

              this.cdRef.markForCheck()
            },
            error: (err) => {
              this.load = true
              this.usersStatics=[]
              this.cdRef.markForCheck()
            }
          }),
            finalize(() => {
              setTimeout(() => {
                this.load = false
              }, 300)
            }))
          .subscribe((res) => {

          })
      })
  }

  returnNameCategory(id: number) {
    let category
    category = this.listCategories.filter(element => element.id == id)
    return category[0].unitName + ' - ' + category[0].categoryName;
  }

}
