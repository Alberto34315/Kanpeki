import { Component } from '@angular/core';
import { LanguageService } from './services/language.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'kanpeki';
  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    message: ['', Validators.required],
  });
  private formUrl = 'https://formspree.io/f/mwkywyrr';
  private headers = new HttpHeaders({ 'content-type': 'application/json' });
  constructor(
    private languageS: LanguageService,
    private fb: FormBuilder,
    private httpClient: HttpClient
  ) {}
  onSubmit(): void {
    console.log(this.contactForm.value);
    
    const contact: any = {
      name: this.contactForm.get('name')?.value,
      email: this.contactForm.get('email')?.value,
      message: this.contactForm.get('message')?.value,
    };
    //Service to handle the http POST request in the background
    this.httpClient
      .post<any>(
        this.formUrl,
        {
          //Post body
          name: contact.name,
          email: contact.email,
          message: contact.message,
        }, 
        {
          headers: this.headers,
        }
      )
      .pipe(
        tap((_) => console.warn('sending message')),
        catchError(this.handleError<any>('sendEmail', []))
      ).subscribe(res=>{
        console.log(res);
        
      });
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //We can stream this log to an platform like CloudWatch
      console.error(error);

      //Let our app keep running
      return of(result as T);
    };
  }
}
