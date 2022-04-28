import { Component, ElementRef, Inject, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RequestUserDTO } from 'src/app/models/request/requestUserDTO';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { ConnectionService } from '../../services/connection.service';
@Component({
  selector: 'app-form-users',
  templateUrl: './form-users.component.html',
  styleUrls: ['./form-users.component.sass']
})
export class FormUsersComponent implements OnInit {
  public roles: string[] = ["USER", "ADMIN"]
  public userMock: RequestUserDTO | ResponseUserDTO = {
    birthday: "",
    city: "",
    email: "",
    fullName: "",
    nickname: "",
    password: "",
    roles: ["USER"],
    urlImage: ""
  }
  myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    fullName: ['', [Validators.required]],
    nickname: ['', [Validators.required]],
    urlImage: ['', [Validators.required]],
    birthday: ['', [Validators.required]],
    city: ['', [Validators.required]],
    roles: ['', [Validators.required]],
  });
  public imagen: any = null;

  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<FormUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResponseUserDTO | RequestUserDTO,
    private fb: FormBuilder,
    private connectionS: ConnectionService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    if (this.data.id) {
      this.myForm = this.fb.group({
        email: [this.data.email, [Validators.required]],
        password: [this.data.password, [Validators.required]],
        fullName: [this.data.fullName, [Validators.required]],
        nickname: [this.data.nickname, [Validators.required]],
        urlImage: ['', [Validators.required]],
        birthday: [this.data.birthday, [Validators.required]],
        city: [this.data.city, [Validators.required]],
        roles: [this.data.roles[0], [Validators.required]],
      });
      this.getImage()
    }
  }
  getImage() {
    let imgArr = this.data.urlImage.split('/')
    this.connectionS.getFile(imgArr[imgArr.length - 1]).subscribe(resp => {
      let objectURL = URL.createObjectURL(resp);
      this.imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    })
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
      urlImage: this.fileInput.nativeElement.files[0]
    }

    if (this.data.id) {
      user.id = this.data.id
      user.urlImage = this.data.urlImage
      console.log(user);
      let fd = new FormData()
      fd.append('id', String(user.id))
      fd.append('birthday', user.birthday)
      fd.append('city', user.city)
      fd.append('email', user.email)
      fd.append('fullName', user.fullName)
      fd.append('nickname', user.nickname)
      fd.append('password', user.password)
      fd.append('roles[]', String(user.roles))

      
      let imgArr = user.urlImage.split('/')
      this.connectionS.getFile(imgArr[imgArr.length - 1]).subscribe(resp => {  
        fd.append("file",resp,'image.png');
        this.connectionS.updateUser(Number(user.id), fd)
      })
    } else {
      let fd = new FormData()
      fd.append('birthday', user2.birthday)
      fd.append('city', user2.city)
      fd.append('email', user2.email)
      fd.append('fullName', user2.fullName)
      fd.append('nickname', user2.nickname)
      fd.append('password', user2.password)
      fd.append('roles[]', user2.roles[0])
      fd.append("file", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
      this.connectionS.addUser(fd)
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
