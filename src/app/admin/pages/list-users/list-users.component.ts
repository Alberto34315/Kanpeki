import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { FormUsersComponent } from '../../components/form-users/form-users.component';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styles: [
  ]
})
export class ListUsersComponent implements OnInit {
  public listUsers: ResponseUserDTO[] = []
  public componentForm: ComponentType<FormUsersComponent>;
  public dialogRef!: MatDialogRef<FormUsersComponent, any>
  public listDeleteElement: any[] = []
  public load: boolean = true
  constructor(private connectionS: ConnectionService, public dialog: MatDialog) {
    this.componentForm = FormUsersComponent
  }

  ngOnInit(): void {
    this.getListUsers()
  }

  getListUsers() {
    this.connectionS.getUsers()
      .subscribe({
        next: (v) => this.listUsers = v,
        complete: () => this.load = false
      })
    this.load = false
  }

  openForm() {
    this.dialogRef = this.dialog.open(FormUsersComponent, {
      width: '550px',
      height: '600px',
      data: {},
      disableClose: true,
      panelClass:'custom-dialog-container'
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listUsers = []
        this.getListUsers()
      }
    });
  }

  deleteUser() {
    if (this.listDeleteElement.length > 0 && this.listUsers.length > 0) {
      this.listDeleteElement.forEach(id => {
        this.connectionS.deleteUser(id).subscribe(res => {
          this.procesaPropagar()
        })
      });
    }
  }

  listDelete(elements: any) {
    this.listDeleteElement = elements;
  }

  procesaPropagar() {
    this.listUsers = []
    this.getListUsers()
  }


}
