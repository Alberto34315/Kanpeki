import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

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
  @Input() nameFormComponent!: ComponentType<any>;
  @Output() propagateFather = new EventEmitter();
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
    this.displayedColumns = Object.keys(this.tableData[0]).filter(resp => { return resp != "id" && resp != "urlImage" })
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
    const dialogRef = this.dialog.open(this.nameFormComponent, {
      width: '450px',
      height: '600px',
      data: data,
    });
    
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource = new MatTableDataSource(<any>[]);
      this.onPropagate()
    });
  }

  onPropagate() {
    this.propagateFather.emit();
  }
}
