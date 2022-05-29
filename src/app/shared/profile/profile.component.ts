import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { FormUsersComponent } from 'src/app/admin/components/form-users/form-users.component';
import { ConnectionService } from 'src/app/admin/services/connection.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { LanguageService } from 'src/app/services/language.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {
  public user!: ResponseUserDTO;
  public themes = new Map<string, string>([
    ["pink", "sakuraFlower"],
    ["dark", "dark"]
  ]);
  public languages = new Map<string, string>([
    ["english", "en"],
    ["spanish", "es"]
  ]);
  public myForm: FormGroup = this.fb.group({
    urlImage: [''],
  });
  private fileInput!: File;

  public dialogRef!: MatDialogRef<FormUsersComponent, any>

  public image: any = null;
  public load: boolean = false;
  public idUser: number = 0
  constructor(private languageS: LanguageService,
    private themeS: ThemeService,
    private router: Router,
    private authS: AuthService,
    private sanitizer: DomSanitizer,
    private connectionSAdmin: ConnectionService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService,
    private fb: FormBuilder,
    public dialog: MatDialog,) { }


  ngOnInit(): void {
    this.connectionSAdmin.getUserMe()
      .pipe(tap({
        next: (res) => {
          if (res) {
            this.load = true;
            this.idUser = res.id
            this.connectionSAdmin.getUserById(res.id)
              .pipe(tap({
                next: (res) => {
                  if (res) {
                    this.load = true;
                    this.user = res
                    this.getImage()
                    this.cdRef.markForCheck()
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
            this.cdRef.markForCheck()
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
      .subscribe(res => {
      })
  }


  public imgChange(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        (<HTMLInputElement>document.getElementById("image")).setAttribute("src", e.target.result);
      }
      this.fileInput = fileInput.target.files[0]
      this.updateUser()
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  updateUser() {
    let fd = new FormData()
    fd.append('id', String(this.idUser))
    fd.append('birthday', String(this.user.birthday))
    fd.append('city', this.user.city)
    fd.append('email', this.user.email)
    fd.append('fullName', this.user.fullName)
    fd.append('nickname', this.user.nickname)
    fd.append('roles[]', String(this.user.roles))
    if (this.fileInput !== undefined) {
      fd.append("file", this.fileInput, this.fileInput.name);
      this.update(fd)
    } else {
      if (this.user.urlImage.replace(/\s+/g, '') !== "") {
        let imgArr = this.user.urlImage.split('/')
        this.connectionSAdmin.getFile(imgArr[imgArr.length - 1])
          .pipe(tap({
            next: (res) => {
              if (res) {
                this.load = true;
                let name = imgArr[imgArr.length - 1].split("_")
                fd.append("file", res, name[name.length - 1]);
                this.update(fd)
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
      } else {
        fd.append("file", new Blob(), "default.png");
        this.update(fd)
      }
    }

  }

  update(fd: FormData) {
    this.connectionSAdmin.updateUser(this.idUser, fd)
      .pipe(tap({
        next: (res) => {
          if (res) {
            this.load = true;
            this.cdRef.markForCheck()
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

  getImage() {
    if (this.user.urlImage != "") {
      let imgArr = this.user.urlImage.split('/')
      this.connectionSAdmin.getFile(imgArr[imgArr.length - 1])
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


  openForm() {
    this.dialogRef = this.dialog.open(FormUsersComponent, {
      width: '550px',
      height: '600px',
      data: this.user,
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit()
      }
    });
  }

  changeLanguage(idiom: string) {
    this.languageS.changeLanguage(idiom)
  }

  changeTheme(theme: string) {
    this.themeS.current = theme;
  }

  logout() {
    this.authS.logout();
    this.router.navigate(['/auth/login'])
  }
}
