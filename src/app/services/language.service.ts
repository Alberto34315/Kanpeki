import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private activeLang = 'es';
  constructor(private translate: TranslateService) {     
    this.translate.setDefaultLang(this.activeLang);
  }

  public changeLanguage(lang:string) {
    this.activeLang = lang;
    this.translate.use(lang);
  }
}
