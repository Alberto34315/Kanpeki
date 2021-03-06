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
import { LoadComponent } from './components/load/load.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutUsComponent } from './about-us/about-us.component';
import { ChartUserModalComponent } from './components/chart-user-modal/chart-user-modal.component';
import { HelpComponent } from './help/help.component';
@NgModule({
  declarations: [
    HeaderComponent,
    ProfileComponent,
    TableComponent,
    ShowAnswerComponent,
    ChartComponent,
    CardComponent,
    StatisticsDataComponent,
    LoadComponent,
    AboutUsComponent,
    ChartUserModalComponent,
    HelpComponent,
  ],
  exports: [HeaderComponent,
    TableComponent,
    MaterialModule,
    NgChartsModule,
    ChartComponent,
    CardComponent,
    SwiperModule,
    StatisticsDataComponent,
    LoadComponent,],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MaterialModule,
    NgChartsModule,
    SwiperModule,
    FormsModule,
    ReactiveFormsModule, 
  ]
})
export class SharedModule { }
