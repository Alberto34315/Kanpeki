import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormUsersComponent } from 'src/app/admin/components/form-users/form-users.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: Object[] = [
];
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass']
})
export class TableComponent implements AfterViewInit, OnInit {
  @Input() tableData!: any[];

  displayedColumns: string[] = [];
  public dataSource!: MatTableDataSource<any>

  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog) {
  }

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  ngOnInit(): void {
    this.displayedColumns = Object.keys(this.tableData[0]).filter(resp => { return resp != "id" && resp!="urlImage"})
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  viewData(data: any) {
    const dialogRef = this.dialog.open(FormUsersComponent, {
      width: '450px',
      height:'600px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
