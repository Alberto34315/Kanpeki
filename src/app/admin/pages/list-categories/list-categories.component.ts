import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { finalize, tap } from 'rxjs';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { FormCategoriesComponent } from '../../components/form-categories/form-categories.component';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styles: [
  ]
})
export class ListCategoriesComponent implements OnInit {
  public listCategories!: ResponseCategoryDTO[]

  public componentForm: ComponentType<FormCategoriesComponent>;
  public dialogRef!: MatDialogRef<FormCategoriesComponent, any>
  public listDeleteElement: any[] = []
  public load: boolean = false;
  constructor(private connectionS: ConnectionService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) {
    this.componentForm = FormCategoriesComponent
  }

  ngOnInit(): void {
    this.getListCategories()
  }

  getListCategories() {
    this.connectionS.getCategories()
      .pipe(tap({
        next: (res) => {
          this.listCategories = []
          this.load = true
          this.listCategories = res
          this.cdRef.markForCheck()
        },
        error: (err) => {
          this.listCategories = []
          this.load = true
          this.cdRef.markForCheck()
        }
      }),
        finalize(() => {
          setTimeout(() => {
            this.load = false
          }, 300)
        }))
      .subscribe((resp) => {
      })
  }

  listDelete(elements: any) {
    this.listDeleteElement = elements;
  }
  openForm() {
    this.dialogRef = this.dialog.open(FormCategoriesComponent, {
      width: '550px',
      height: '350px',
      data: {},
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listCategories = []
        this.getListCategories()
      }
    });
  }

  deleteCategories() {
    if (this.listDeleteElement.length > 0 && this.listCategories.length > 0) {
      this.errorMsgS.deleteElement().then((res) => {
        if (res.isConfirmed) {
          this.listDeleteElement.forEach(id => {
            this.connectionS.deleteCategories(id).subscribe(res => {
              this.procesaPropagar()
            })
          });
        }
      })

    }
  }

  procesaPropagar() {
    this.listCategories = []
    this.getListCategories()
  }


}
