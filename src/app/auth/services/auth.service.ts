import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ConnectionService } from 'src/app/admin/services/connection.service';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { api } from 'src/environments/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = api.apiUrl
  private kanpeki: string = api.kanpeki
  private users: string = api.user
  private token: string = api.token
  private authU: string = api.authU
  private authP: string = api.authP
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    })
  }

  private httpOptionsAuth = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${this.authU}:${this.authP}`)
    })
  };
  constructor(private http: HttpClient) { }

  login(email: string, pass: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}${this.token}?grant_type=password&username=${email}&password=${pass}`,
      {},
      this.httpOptionsAuth
    )
  }
  register(){
    
  }
  setToken(token: string) {
    localStorage.setItem("jwt", token)
  }

  getToken(): string {
    return String(localStorage.getItem("jwt"))
  }

  validarToken(): Observable<boolean> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      })
    }
    return this.http.get<ResponseUserDTO[]>(`${this.apiUrl}${this.kanpeki}${this.users}/me`, this.httpOptions).pipe(
      map(resp => {
        return true
      }),
      catchError(err => of(false))
    )

  }

  logout() {
    localStorage.clear();
  }
}
