import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartConfiguration, ChartType } from 'chart.js';
import { finalize, tap } from 'rxjs';
import { RequestUserDTO } from 'src/app/models/request/requestUserDTO';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ResponseResultDTO } from 'src/app/models/response/responseResultDTO';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { ConnectionService } from 'src/app/user/services/connection.service';

@Component({
  selector: 'app-chart-user-modal',
  templateUrl: './chart-user-modal.component.html',
  styleUrls: ['./chart-user-modal.component.sass']
})
export class ChartUserModalComponent implements OnInit {

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
  public userStatics!: ResponseResultDTO[]
  public userStaticsAVG!: any[]
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ResponseUserDTO | RequestUserDTO,
    private connectionS: ConnectionService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) {
  }

  ngOnInit(): void {
    this.connectionS.getCategories()
      .pipe(tap({
        next: (res) => {
          this.load = true
          this.listCategories = res
          if (this.data.id) {
            this.loadDataById(this.data.id)
          }
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


  loadDataById(id: number) {
    this.connectionS.getResultsUser(id)
      .pipe(tap({
        next: (res) => {
          if (res) {
            this.userStatics = []
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
          this.userStatics = []
          this.load = true
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

    this.connectionS.getResultsUserCustom(id)
      .pipe(tap({
        next: (res) => {
          if (res) {
            this.userStaticsAVG = []
            this.load = true;
            this.userStaticsAVG = res
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
          this.userStaticsAVG = []
          this.load = true
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
  }

  returnNameCategory(id: number) {
    let category
    category = this.listCategories.filter(element => element.id == id)
    return category[0].unitName + ' - ' + category[0].categoryName;
  }

}
