import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ConnectionService } from '../../services/connection.service';
import { formatDate } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ResponseResultDTO } from 'src/app/models/response/responseResultDTO';
registerLocaleData(localeES, 'es');
@Component({
  selector: 'app-statistics-user',
  templateUrl: './statistics-user.component.html',
  styles: [
  ]
})
export class StatisticsUserComponent implements OnInit {
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
  constructor(private connectionS: ConnectionService) {
  }

  ngOnInit(): void {
    this.connectionS.getCategories()
      .subscribe(res => {
        this.listCategories = res
        this.loadData()
      })
  }

  loadData() {
    this.connectionS.getUserMe().subscribe((res) => {
      this.connectionS.getResultsUser(res.id).subscribe((res) => {
        this.userStatics=res
        res.forEach((element, i) => {
          this.barChartData.datasets.forEach((value) => {
            value.data.unshift(element.score)
          })
          let dateFormat = formatDate(new Date(element.resultDate), 'YYYY-MM-dd', 'es');
          this.barChartData.labels?.unshift(dateFormat)
        });
      })
      this.connectionS.getResultsUserCustom(res.id).subscribe((res) => {
        res.forEach((element, i) => {
          this.pieChartData.datasets.forEach((value) => {
            value.data.unshift(element.numResults)
          })
          this.pieChartData.labels?.unshift(this.returnNameCategory(element.categoryId))
        });
      })
    })
  }

  returnNameCategory(id: number) {
    let category
    category = this.listCategories.filter(element => element.id == id)
    return category[0].unitName + ' - ' + category[0].categoryName;
  }

}
