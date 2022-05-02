import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { SelectionModel } from '@angular/cdk/collections';

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
  @Output() listDeleteElementOut = new EventEmitter();
  displayedColumns: string[] = [];
  public dataSource!: MatTableDataSource<any>
  public selection = new SelectionModel<PeriodicElement>(true, []);
  public listDeleteElement: any[] = []
  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog) {
  }

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
  }

  ngOnInit(): void {
    this.displayedColumns = Object.keys(this.tableData[0]).filter(resp => {
      return resp != "id"
        && resp != "urlImage"
        && resp != "createdAt"
        && resp != "lastPasswordChangeAt"
    })
    this.displayedColumns.unshift("select")
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  searchElement($event:any){
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();  
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
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource = new MatTableDataSource(<any>[]);
        this.onPropagate()
      }
    });
  }

  onPropagate() {
    this.propagateFather.emit();
  }

  rowSelected($event: any, row: any) {
    if (!this.selection.isSelected(row)) {
      this.listDeleteElement.push(row.id)
    } else {
      this.listDeleteElement = this.listDeleteElement.filter(id => id !== row.id)
    }
    this.listDeleteElementOut.emit(this.listDeleteElement)
    $event.stopPropagation()
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  masterToggle() {
    this.listDeleteElement = []
    if (this.isAllSelected()) {
      this.selection.clear()
    } else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row)
        this.listDeleteElement.push(row.id)
      });
    }
    this.listDeleteElementOut.emit(this.listDeleteElement)
  }
}
