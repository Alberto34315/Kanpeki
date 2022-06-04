import { Component } from '@angular/core';
import { LanguageService } from './services/language.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, Observable, of } from 'rxjs';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'kanpeki';
  constructor(
    private themeS: ThemeService,
    private languageS: LanguageService,
  ) { }

}
