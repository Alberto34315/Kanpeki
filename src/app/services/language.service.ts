import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private activeLang = 'es';
  constructor(private translate: TranslateService) {
    if (localStorage.getItem("language") != null) {
      this.activeLang = String(localStorage.getItem("language"))
    }
    this.translate.setDefaultLang(this.activeLang);
  }
  public getIdiom(){
    return this.activeLang
  }
  public changeLanguage(lang: string) {
    this.activeLang = lang;
    localStorage.setItem("language", this.activeLang)
    this.translate.use(this.activeLang);
  }
}
