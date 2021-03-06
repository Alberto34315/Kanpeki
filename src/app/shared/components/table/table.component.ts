import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { SelectionModel } from '@angular/cdk/collections';
import { AnswerDTO } from 'src/app/models/answerDTO';
import { ShowAnswerComponent } from '../show-answer/show-answer.component';
import { StatisticsDataComponent } from '../statistics-data/statistics-data.component';
import { bind, unbind } from 'wanakana';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ConnectionService } from 'src/app/user/services/connection.service';
import { tap } from 'rxjs';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';

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
  @Input() statistics: boolean = false;
  @Output() propagateFather = new EventEmitter();
  @Output() listDeleteElementOut = new EventEmitter();
  displayedColumns: string[] = [];
  public dataSource!: MatTableDataSource<any>
  public selection = new SelectionModel<PeriodicElement>(true, []);
  public listDeleteElement: any[] = []
  public checkHiragana: boolean = false;
  public categoryName: string = ""
  public listCategories!: ResponseCategoryDTO[]
  public search!: HTMLInputElement;
  constructor(private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private connectionS: ConnectionService) {
  }

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator
    this.search = (<HTMLInputElement>document.getElementById("search-input"));
  }

  ngOnInit(): void {
    this.getListCategories()
    this.displayedColumns = Object.keys(this.tableData[0]).filter(resp => {
      return resp != "id"
        && resp != "urlImage"
        && resp != "createdAt"
        && resp != "lastPasswordChangeAt"
        && resp != "userId"
    })
    if (!this.statistics) {
      this.displayedColumns.unshift("select")
    }
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  getListCategories() {
    this.connectionS.getCategories()
      .pipe(tap({
        next: (res) => {
          this.listCategories = []
          this.listCategories = res
        },
        error: (err) => {
          this.listCategories = []
        }
      }))
      .subscribe((resp) => {
      })
  }

  returnNameCategory(id: number) {
    if (this.listCategories !== undefined) {
      let category = this.listCategories.filter(res => res.id === id)[0]
      return category.unitName + " - " + category.categoryName
    } else {
      return []
    }
  }

  searchElement($event: any) {
    const filterValue = $event.target.value;
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
    if (!this.statistics) {
      const dialogRef = this.dialog.open(this.nameFormComponent, {
        width: '550px',
        height: (this.nameFormComponent.name === "FormCategoriesComponent") ? '350px' : '600px',
        data: data,
        disableClose: true,
        panelClass: 'custom-dialog-container'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dataSource = new MatTableDataSource(<any>[]);
          this.onPropagate()
        }
      });
    } else {
      this.dialog.open(StatisticsDataComponent, {
        width: '500px',
        height: '300px',
        data: data,
        panelClass: 'custom-dialog-container'
      });
    }
  }

  showAnswers(answer: AnswerDTO) {
    this.dialog.open(ShowAnswerComponent, {
      width: '270px',
      height: '300px',
      data: answer,
      panelClass: 'custom-dialog-container'
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

  isObject(element: any) {
    return (typeof element === 'object');
  }

  hiragana($event: MatSlideToggleChange) {
    this.checkHiragana = $event.checked
    if (this.checkHiragana) {
      bind(this.search)
    } else {
      unbind(this.search)
    }
  }
}
