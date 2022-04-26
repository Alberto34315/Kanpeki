import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileComponent } from './profile/profile.component';
import { TableComponent } from './components/table/table.component';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    HeaderComponent,
    ProfileComponent,
    TableComponent,
  ],
  exports: [HeaderComponent, TableComponent],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MaterialModule,
  ]
})
export class SharedModule { }
