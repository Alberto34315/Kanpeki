import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/admin/services/connection.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { LanguageService } from 'src/app/services/language.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {
  public user!:ResponseUserDTO;
  public themes = new Map<string, string>([
    ["pink", "sakuraFlower"],
    ["dark", "dark"]
  ]);
  public languages = new Map<string, string>([
    ["english", "en"],
    ["spanish", "es"]
  ]);
  
  public image: any = null;
  constructor(private languageS: LanguageService, 
    private themeS: ThemeService, 
    private router: Router, 
    private authS: AuthService,
    private sanitizer: DomSanitizer,
    private connectionSAdmin:ConnectionService) { }

  ngOnInit(): void {
    this.connectionSAdmin.getUserMe().subscribe(res=>{
      this.user=res
      console.log(this.user);
      this.getImage()
    })
  }
  getImage() {
    if (this.user.urlImage != "") {
      let imgArr = this.user.urlImage.split('/')
      this.connectionSAdmin.getFile(imgArr[imgArr.length - 1]).subscribe(resp => {
        let objectURL = URL.createObjectURL(resp);
        this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
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
