import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styles: [
  ]
})
export class ListUsersComponent implements OnInit {
  public listUsers: ResponseUserDTO[] = []
  constructor(private connectionS: ConnectionService) { }

  ngOnInit(): void {
    this.getListUsers()
  }

  getListUsers() {
    this.connectionS.getUsers()
      .subscribe((resp) => {
        this.listUsers = resp;
      })
  }

}
