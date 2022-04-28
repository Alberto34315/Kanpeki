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

  public load: boolean = true;

  private fileInput!: ElementRef;

  @ViewChild('fileInput') set content(fileInput: ElementRef) {
    if (fileInput) {
      this.fileInput = fileInput;
    }
  }
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
    if (this.data.urlImage != "") {
      let imgArr = this.data.urlImage.split('/')
      this.connectionS.getFile(imgArr[imgArr.length - 1]).subscribe(resp => {
        let objectURL = URL.createObjectURL(resp);
        this.imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      })
    }
  }


  save() {
    this.load = false;
    let user: RequestUserDTO = this.myForm.value
    let fd = new FormData()
    if (this.data.id) {
      user.id = this.data.id
      user.urlImage = this.data.urlImage
      fd.append('id', String(user.id))
      fd.append('birthday', user.birthday)
      fd.append('city', user.city)
      fd.append('email', user.email)
      fd.append('fullName', user.fullName)
      fd.append('nickname', user.nickname)
      fd.append('password', user.password)
      fd.append('roles[]', String(user.roles))
      if (this.fileInput !== undefined) {
        fd.append("file", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
        this.connectionS.updateUser(Number(user.id), fd).subscribe((res) => {
          if (res) {
            this.load = true;
            this.onClose()
          }
        })
      } else {
        let imgArr = user.urlImage.split('/')
        this.connectionS.getFile(imgArr[imgArr.length - 1]).subscribe(resp => {
          fd.append("file", resp, 'image.png');

          this.connectionS.updateUser(Number(user.id), fd).subscribe((res) => {
            if (res) {
              this.load = true;
              this.onClose()
            }
          })

        })
      }
    } else {
      fd.append('birthday', user.birthday)
      fd.append('city', user.city)
      fd.append('email', user.email)
      fd.append('fullName', user.fullName)
      fd.append('nickname', user.nickname)
      fd.append('password', user.password)
      fd.append('roles[]', String(user.roles))
      if (this.fileInput !== undefined && this.fileInput.nativeElement.files[0]!== undefined ) {
                fd.append("file", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
      }
      this.connectionS.addUser(fd).subscribe((res) => {
        if (res) {
          this.load = true;
          this.onClose()
        }
      })
    }
  }

  onClose(): void {
    this.dialogRef.close()
  }
}
