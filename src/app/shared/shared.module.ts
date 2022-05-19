import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileComponent } from './profile/profile.component';
import { TableComponent } from './components/table/table.component';
import { MaterialModule } from './material/material.module';
import { NgChartsModule } from 'ng2-charts';
import { ShowAnswerComponent } from './components/show-answer/show-answer.component';
import { ChartComponent } from './components/chart/chart.component';
import { CardComponent } from './components/card/card.component';
import { SwiperModule } from 'swiper/angular';
import { StatisticsDataComponent } from './components/statistics-data/statistics-data.component';
@NgModule({
  declarations: [
    HeaderComponent,
    ProfileComponent,
    TableComponent,
    ShowAnswerComponent,
    ChartComponent,
    CardComponent,
    StatisticsDataComponent,
  ],
  exports: [HeaderComponent,
    TableComponent,
    MaterialModule,
    NgChartsModule,
    ChartComponent,
    CardComponent,
    SwiperModule,
    StatisticsDataComponent,],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MaterialModule,
    NgChartsModule,
    SwiperModule
  ]
})
export class SharedModule { }
