import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ConnectionService } from '../../services/connection.service';
import { formatDate } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ResponseResultDTO } from 'src/app/models/response/responseResultDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { finalize, tap } from 'rxjs';
registerLocaleData(localeES, 'es');
@Component({
  selector: 'app-statistics-user',
  templateUrl: './statistics-user.component.html',
  styles: [
  ]
})
export class StatisticsUserComponent implements OnInit {

  public load: boolean = false;
  //-------------------------------------------------------

  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: "Nota"
      }
    ]
  };
  // bar
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      xAxes:
      {
        display: true,
        beginAtZero: true,
        ticks: {
          autoSkip: false
        }
      },
      yAxes:
      {
        beginAtZero: true,
        ticks: {
          autoSkip: false,
        },
        suggestedMax: 10,
      }

    },
    plugins: {
      title: {
        display: true,
        text: 'Notas de los examenes',
        position: 'top'
      },

      legend: {
        display: false,
      }
    }
  };

  public barChartType: ChartType = 'bar';
  //--------------------------------------------------

  //--------------------------------------------------------------------------------------------
  public pieChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: []
    }]
  };

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
  public userStatics: ResponseResultDTO[] = []
  public userStaticsAVG: any[] = []
  constructor(private connectionS: ConnectionService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) {
  }

  ngOnInit(): void {
    this.connectionS.getCategories()
      .pipe(tap({
        next: (res) => {
          this.load = true
          this.listCategories = res
          this.loadData()
          this.cdRef.markForCheck()
        },
        error: (err) => {
          this.load = true
          this.cdRef.markForCheck()
          this.errorMsgS.showErrorMessage(err)
        }
      }),
        finalize(() => {
          setTimeout(() => {
            this.load = false
          }, 300)
        }))
      .subscribe(res => {
      })
  }

  loadData() {
    this.connectionS.getUserMe()
      .pipe(tap({
        next: (res) => {
          if (res) {
            this.load = true;
            this.connectionS.getResultsUser(res.id)
              .pipe(tap({
                next: (res) => {
                  if (res) {
                    this.load = true;
                    this.userStatics = res
                    res.forEach((element, i) => {
                      this.barChartData.datasets.forEach((value) => {
                        value.data.unshift(element.score)
                      })
                      let dateFormat = formatDate(new Date(element.resultDate), 'YYYY-MM-dd', 'es');
                      this.barChartData.labels?.unshift(dateFormat)
                    });
                    this.cdRef.markForCheck()
                  }
                },
                error: (err) => {
                  this.load = true
                  this.cdRef.markForCheck()
                  this.errorMsgS.showErrorMessage(err)
                }
              }),
                finalize(() => {
                  setTimeout(() => {
                    this.load = false
                  }, 300)
                }))
              .subscribe((res) => {
              })

            this.connectionS.getResultsUserCustom(res.id)
              .pipe(tap({
                next: (res) => {
                  if (res) {
                    this.load = true;
                    this.userStaticsAVG=res
                    res.forEach((element, i) => {
                      this.pieChartData.datasets.forEach((value) => {
                        value.data.unshift(element.numResults)
                      })
                      this.pieChartData.labels?.unshift(this.returnNameCategory(element.categoryId))
                    });
                    this.cdRef.markForCheck()
                  }
                },
                error: (err) => {
                  this.load = true
                  this.cdRef.markForCheck()
                  this.errorMsgS.showErrorMessage(err)
                }
              }),
                finalize(() => {
                  setTimeout(() => {
                    this.load = false
                  }, 300)
                }))
              .subscribe((res) => {
              })
            this.cdRef.markForCheck()
          }
        },
        error: (err) => {
          this.load = true
          this.cdRef.markForCheck()
          this.errorMsgS.showErrorMessage(err)
        }
      }),
        finalize(() => {
          setTimeout(() => {
            this.load = false
          }, 300)
        }))
      .subscribe((res) => {
      })
  }

  returnNameCategory(id: number) {
    let category
    category = this.listCategories.filter(element => element.id == id)
    return category[0].unitName + ' - ' + category[0].categoryName;
  }

}
