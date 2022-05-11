import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ConnectionService } from '../../services/connection.service';
import { formatDate } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
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
    datasets: [{
      data: [],
      label: ''
    }]
  };
  // bar
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      xAxes:
      {
        display: false,
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
        stacked: true,
        suggestedMax: 10,
      }

    },
    plugins: {
      title: {
        display: true,
        text: 'Notas de los examenes por categorías',
        position: 'top'
      },

      legend: {
        display: false,
      }
    }
  };

  public barChartType: ChartType = 'bar';
  //--------------------------------------------------
  public listCategories: ResponseCategoryDTO[] = []
  constructor(private connectionS: ConnectionService) { }

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
        res.forEach((element, i) => {
          this.barChartData.datasets.forEach((value) => {
            value.data.push(element.score)
            let dateFormat = formatDate(new Date(element.resultDate), 'YYYY-MM-dd', 'es');
            value.label = dateFormat
          })
          this.barChartData.labels?.unshift(this.returnNameCategory(element.categoryId))
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
