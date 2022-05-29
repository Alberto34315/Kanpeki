import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { ConnectionService } from 'src/app/admin/services/connection.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  public headerRol: boolean = false
  public rol: string = ""
  public load: boolean = false;
  constructor(private router: Router, private connectionAdminService: ConnectionService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) { }

  ngOnInit(): void {
    this.connectionAdminService.getUserMe()

      .pipe(tap({
        next: (res) => {
          if (res) {
            this.load = true;
            this.rol = res.roles[0]
            if (this.rol === "ADMIN") {
              this.headerRol = true
            }
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
      .subscribe((res) => {
      })
  }

  goProfile() {
    if (this.rol === "ADMIN") {
      this.router.navigate(["./admin/profile"])
    } else {
      this.router.navigate(["./user/profile"])
    }
  } 
  goAboutUs() {
    if (this.rol === "ADMIN") {
      this.router.navigate(["./admin/aboutUs"])
    } else {
      this.router.navigate(["./user/aboutUs"])
    }
  }
}
