import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
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
  constructor(private connectionS: ConnectionService, public dialog: MatDialog,) {
    this.componentForm = FormUsersComponent
  }

  ngOnInit(): void {
    this.getListUsers()
  }
  getListUsers() {
    this.connectionS.getUsers()
      .subscribe((resp) => {
        this.listUsers = resp;
      })
  }
  openForm() {
    this.dialogRef = this.dialog.open(FormUsersComponent, {
      width: '450px',
      height: '600px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe(result => {
      this.listUsers = []
      this.getListUsers()
    });
  }

  procesaPropagar() {
    this.listUsers = []
    this.getListUsers()
  }
}
