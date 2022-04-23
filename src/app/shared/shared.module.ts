import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileComponent } from './profile/profile.component';
import { TableComponent } from './components/table/table.component';
import { MatSortModule } from '@angular/material/sort';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';

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
    MatSortModule,
    CdkTableModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class SharedModule { }
