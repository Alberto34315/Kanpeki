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

@NgModule({
  declarations: [
    HeaderComponent,
    ProfileComponent,
    TableComponent,
    ShowAnswerComponent,
  ],
  exports: [HeaderComponent,
    TableComponent,
    MaterialModule,
    NgChartsModule,],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MaterialModule,
    NgChartsModule,
  ]
})
export class SharedModule { }
