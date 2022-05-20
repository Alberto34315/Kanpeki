import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { finalize, tap } from 'rxjs';
import { RequestUserDTO } from 'src/app/models/request/requestUserDTO';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { ValidFormService } from 'src/app/services/valid-form.service';
import { ConnectionService } from '../../services/connection.service';
@Component({
  selector: 'app-form-users',
  templateUrl: './form-users.component.html',
  styleUrls: ['./form-users.component.sass']
})
export class FormUsersComponent implements OnInit {
  public roles: string[] = ["USER", "ADMIN", "PENDING_APPROVAL"]

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i)]],
    fullName: ['', [Validators.required, Validators.maxLength(40)]],
    nickname: ['', [Validators.required, Validators.maxLength(40)]],
    urlImage: [''],
    birthday: ['', [Validators.required]],
    city: ['', [Validators.required, Validators.maxLength(40)]],
    roles: ['', [Validators.required]],
  });

  public image: any = null;

  public load: boolean = false;

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
    private sanitizer: DomSanitizer,
    private valiFormS: ValidFormService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService
  ) {
    this.valiFormS.myForm = this.myForm
  }

  ngOnInit(): void {
    if (this.data.id) {
      this.myForm.get('email')?.patchValue(this.data.email);
      this.myForm.get('password')?.patchValue(this.data.password);
      this.myForm.get('fullName')?.patchValue(this.data.fullName);
      this.myForm.get('nickname')?.patchValue(this.data.nickname);
      this.myForm.get('birthday')?.patchValue(this.data.birthday);
      this.myForm.get('city')?.patchValue(this.data.city);
      this.myForm.get('roles')?.patchValue(this.data.roles[0]);

      this.getImage()
    }
  }

  getImage() {
    if (this.data.urlImage != "") {
      let imgArr = this.data.urlImage.split('/')
      this.connectionS.getFile(imgArr[imgArr.length - 1])
        .pipe(tap({
          next: (res) => {
            if (res) {
              this.load = true;
              let objectURL = URL.createObjectURL(res);
              this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              this.cdRef.markForCheck()
            }
          },
          error: (err) => {
            this.load = true
            this.cdRef.markForCheck()
            this.errorMsgS.showErrorImage()
          }
        }),
          finalize(() => {
            setTimeout(() => {
              this.load = false
            }, 300)
          }))
        .subscribe(resp => {
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

      if (user.password !== undefined) {
        fd.append('password', user.password)
      } else {
        fd.append('password', '')
      }
      fd.append('roles[]', String(user.roles))
      if (this.fileInput !== undefined && this.fileInput.nativeElement.files[0] !== undefined) {
        fd.append("file", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
        this.updateUser(Number(user.id), fd)
      } else {
        if (user.urlImage.replace(/\s+/g, '') !== "") {
          let imgArr = user.urlImage.split('/')
          this.connectionS.getFile(imgArr[imgArr.length - 1]).subscribe(resp => {
            let name = imgArr[imgArr.length - 1].split("_")
            fd.append("file", resp, name[name.length - 1]);
            this.updateUser(Number(user.id), fd)
          })
        } else {
          fd.append("file", new Blob(), "default.png");
          this.updateUser(Number(user.id), fd)
        }
      }
    } else {
      fd.append('birthday', user.birthday)
      fd.append('city', user.city)
      fd.append('email', user.email)
      fd.append('fullName', user.fullName)
      fd.append('nickname', user.nickname)
      if (user.password !== undefined) {
        fd.append('password', user.password)
      } else {
        fd.append('password', '')
      }
      fd.append('roles[]', String(user.roles))
      if (this.fileInput !== undefined && this.fileInput.nativeElement.files[0] !== undefined) {
        fd.append("file", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
      } else {
        fd.append("file", new Blob(), "default.png");
      }

      this.connectionS.addUser(fd)
        .pipe(tap({
          next: (res) => {
            if (res) {
              this.load = true;
              this.cdRef.markForCheck()
              this.onClose()
            }
          },
          error: (err) => {
            this.load = true
            this.cdRef.markForCheck()
            this.errorMsgS.showErrorMessage(err)
          }
        }),
          finalize(() => {
            setTimeout(() => {
              this.load = false
            }, 300)
          }))
        .subscribe((res) => {
        })
    }
  }

  updateUser(id: number, fd: FormData) {
    this.connectionS.updateUser(id, fd)
      .pipe(tap({
        next: (res) => {
          if (res) {
            this.load = true;
            this.cdRef.markForCheck()
            this.onClose()
          }
        },
        error: (err) => {
          this.load = true
          this.cdRef.markForCheck()
          this.errorMsgS.showErrorMessage(err)
        }
      }),
        finalize(() => {
          setTimeout(() => {
            this.load = false
          }, 300)
        }))
      .subscribe((res) => {
      })
  }


  deleteImage() {
    this.data.urlImage = '';
    this.image = '../../../../assets/img/profileDefault.png'
  }

  onClose(): void {
    this.dialogRef.close(true)
  }

  fieldIsRequired(field: string) {
    return this.valiFormS.fieldIsRequired(field)
  }

  emailIsValid(field: string) {
    return this.valiFormS.emailIsValid(field)
  }

  passwordIsValid(field: string) {
    return this.valiFormS.passwordIsValid(field)
  }

  maxLengthdIsValid(field: string) {
    return this.valiFormS.maxLengthdIsValid(field)
  }

  validSubmit() {
    let email = this.myForm.get("email")?.invalid
    let fullName = this.myForm.get("fullName")?.invalid
    let nickname = this.myForm.get("nickname")?.invalid
    let birthday = this.myForm.get("birthday")?.invalid
    let city = this.myForm.get("city")?.invalid
    let roles = this.myForm.get("roles")?.invalid

    return (email || fullName || nickname || birthday || city || roles)

  }
}
