import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { finalize, tap } from 'rxjs';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { FormUsersComponent } from '../../components/form-users/form-users.component';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styles: [
  ]
})
export class ListUsersComponent implements OnInit {
  public listUsers!: ResponseUserDTO[]
  public componentForm: ComponentType<FormUsersComponent>;
  public dialogRef!: MatDialogRef<FormUsersComponent, any>
  public listDeleteElement: any[] = []
  public load: boolean = false;
  constructor(
    private connectionS: ConnectionService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) {
    this.componentForm = FormUsersComponent
  }

  ngOnInit(): void {
    this.getListUsers()
  }

  getListUsers() {
    this.connectionS.getUsers()
      .pipe(tap({
        next: (res) => {
          this.listUsers = []
          this.load = true
          this.listUsers = res
          this.cdRef.markForCheck()
        },
        error: (err) => {
          this.listUsers = []
          this.load = true
          this.cdRef.markForCheck()
        }
      }),
        finalize(() => {
          setTimeout(() => {
            this.load = false
          }, 300)
        }))
      .subscribe({
      })
  }

  openForm() {
    this.dialogRef = this.dialog.open(FormUsersComponent, {
      width: '550px',
      height: '600px',
      data: {},
      disableClose: true,
      panelClass: 'custom-dialog-container'
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
      this.errorMsgS.deleteElement().then((res) => {
        if (res.isConfirmed) {
          this.listDeleteElement.forEach(id => {
            this.connectionS.deleteUser(id)
              .pipe(tap({
                next: (res) => {
                  this.procesaPropagar()
                },
                error: (err) => {
                  this.errorMsgS.showErrorMessage(err)
                }
              }))
              .subscribe(res => {
              })
          });
        }
      })


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
