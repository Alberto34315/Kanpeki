import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { FormCategoriesComponent } from '../../components/form-categories/form-categories.component';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styles: [
  ]
})
export class ListCategoriesComponent implements OnInit {
  public listCategories: ResponseCategoryDTO[] = []

  public componentForm: ComponentType<FormCategoriesComponent>;
  public dialogRef!: MatDialogRef<FormCategoriesComponent, any>
  public listDeleteElement: any[] = []
  public load: boolean = true
  constructor(private connectionS: ConnectionService, public dialog: MatDialog) {
    this.componentForm = FormCategoriesComponent
  }

  ngOnInit(): void {  
  this.getListCategories()
}
openForm() {
  this.dialogRef = this.dialog.open(FormCategoriesComponent, {
    width: '550px',
    height: '350px',
    data: {},
    disableClose: true,
    panelClass:'custom-dialog-container'
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
    this.listDeleteElement.forEach(id => {
      this.connectionS.deleteCategories(id).subscribe(res => {
        this.procesaPropagar()
      })
    });
  }
}
getListCategories() {
  this.connectionS.getCategories()
    .subscribe((resp) => {
      this.listCategories=resp
    })
  }
  listDelete(elements: any) {
    this.listDeleteElement = elements;
  }

  procesaPropagar() {
    this.listCategories = []
    this.getListCategories()
  }


}
