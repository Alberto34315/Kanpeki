import { NgModule } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
@NgModule({
    exports: [
        MatSortModule,
        CdkTableModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        MatIconModule
    ],
  })
  export class MaterialModule {}