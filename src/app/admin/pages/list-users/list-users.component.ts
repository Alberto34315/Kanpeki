import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    const dialogRef = this.dialog.open(FormUsersComponent, {
      width: '450px',
      height: '600px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
