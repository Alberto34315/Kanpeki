import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  constructor(private languageS: LanguageService) { }

  ngOnInit(): void {
  }
  changeLanguage(idiom: string) {
    this.languageS.changeLanguage(idiom)
  }
}
