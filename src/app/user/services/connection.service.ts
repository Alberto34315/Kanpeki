import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ResponseResultDTO } from 'src/app/models/request/requestResultDTO';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { api } from 'src/environments/api';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private apiUrl: string = api.apiUrl
  private kanpeki: string = api.kanpeki
  private results: string = api.result  
  private categories: string = api.category
  private users: string = api.user
  private httpOptions
  constructor(private http: HttpClient, private authS: AuthService) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
  }

  //USER----------------------------------------------------------------------------------------------------------------------
  getUserMe(): Observable<ResponseUserDTO> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
    return this.http.get<ResponseUserDTO>(`${this.apiUrl}${this.kanpeki}${this.users}/me`, this.httpOptions)
  }
  //---------------------------------------------------------------------------------------------------------------------------

  //CATEGORY---------------------------------------------------------------------------------------------------------------------
  getCategories(): Observable<ResponseCategoryDTO[]> {
    return this.http.get<ResponseCategoryDTO[]>(`${this.apiUrl}${this.kanpeki}${this.categories}`, this.httpOptions)
  }
  //---------------------------------------------------------------------------------------------------------------------------
  //STATISTICS--------------------------------------------------------------------------------------------------------------
  getResultsUser(id:number): Observable<ResponseResultDTO[]> {
    return this.http.get<ResponseResultDTO[]>(`${this.apiUrl}${this.kanpeki}${this.results}/result/user?id=${id}`, this.httpOptions)
  }
  //---------------------------------------------------------------------------------------------------------------------
}
