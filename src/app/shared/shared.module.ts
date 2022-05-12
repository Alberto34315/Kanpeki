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
@NgModule({
  declarations: [
    HeaderComponent,
    ProfileComponent,
    TableComponent,
    ShowAnswerComponent,
    ChartComponent,
    CardComponent,
  ],
  exports: [HeaderComponent,
    TableComponent,
    MaterialModule,
    NgChartsModule,
    ChartComponent,
    CardComponent,
    SwiperModule],
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
