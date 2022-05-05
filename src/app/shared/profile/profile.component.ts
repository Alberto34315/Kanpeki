import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  public themes = new Map<string, string>([
    ["pink", "sakuraFlower"],
    ["dark", "dark"]
  ]);
  public languages = new Map<string, string>([
    ["english", "en"],
    ["spanish", "es"]
  ]);
  constructor(private languageS: LanguageService, private themeS: ThemeService, private router: Router, private authS: AuthService) { }

  ngOnInit(): void {
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
