import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
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

  public image: any = null;
  public load: boolean = false;
  constructor(private languageS: LanguageService,
    private themeS: ThemeService,
    private router: Router,
    private authS: AuthService,
    private sanitizer: DomSanitizer,
    private connectionSAdmin: ConnectionService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) { }

  ngOnInit(): void {
    this.connectionSAdmin.getUserMe()
      .pipe(tap({
        next: (res) => {
          if (res) {
            this.load = true;
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
