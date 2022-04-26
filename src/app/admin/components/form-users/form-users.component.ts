import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestUserDTO } from 'src/app/models/request/requestUserDTO';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { ConnectionService } from '../../services/connection.service';
@Component({
  selector: 'app-form-users',
  templateUrl: './form-users.component.html',
  styleUrls: ['./form-users.component.sass']
})
export class FormUsersComponent implements OnInit {
  myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    fullName: ['', [Validators.required]],
    nickname: ['', [Validators.required]],
    file: ['', [Validators.required]],
    birthday: ['', [Validators.required]],
    city: ['', [Validators.required]],
    roles: ['', [Validators.required]],
  });

  public selectedFiles!: FileList
  public currentFileUpload!: File
  constructor(
    public dialogRef: MatDialogRef<FormUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResponseUserDTO | RequestUserDTO,
    private fb: FormBuilder,
    private connectionS: ConnectionService
  ) { }

  ngOnInit(): void {

  }
  
  onFileChanged(event: any) {
    this.selectedFiles = event.target.files;
  }

  save() {
    let user: RequestUserDTO = this.myForm.value

    let user2: RequestUserDTO = {
      birthday: "1989-12-31",
      city: "Kyoto",
      email: "kanjilovers@gmail.com",
      fullName: "John Doe",
      nickname: "John Doe",
      password: "C4c4hu3t3!!",
      roles: [
        'USER'
      ],
      urlImage: this.selectedFiles.item(0)
    }
    
    let fd = new FormData()
    fd.append('birthday', user2.birthday)
    fd.append('city', user2.city)
    fd.append('email', user2.email)
    fd.append('fullName', user2.fullName)
    fd.append('nickname', user2.nickname)
    fd.append('password', user2.password)
    fd.append('roles[]',user2.roles[0])
    fd.append("file", new Blob([JSON
      .stringify(user2.urlImage)], {
      type: 'application/json'
    }));

  //  fd.append("file", JSON.stringify(user2.urlImage))
    this.connectionS.addUser(fd)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
