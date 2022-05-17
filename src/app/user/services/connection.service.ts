import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RequestResultDTO } from 'src/app/models/request/requestResultDTO';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { api } from 'src/environments/api';
import { ResponseWordDTO } from '../../models/response/responseWordDTO';
import { ResponseQuestionDTO } from '../../models/response/responseQuestionDTO';
import { ResponseResultDTO } from 'src/app/models/response/responseResultDTO';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private apiUrl: string = api.apiUrl;
  private kanpeki: string = api.kanpeki;
  private results: string = api.result;
  private words: string = api.word;
  private categories: string = api.category;
  private questions: string = api.question;
  private files: string = api.files;
  private users: string = api.user;
  private httpOptions;
  constructor(private http: HttpClient, private authS: AuthService) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authS.getToken(),
      }),
    };
  }
  //FILE---------------------------------------------------------------------------------------------------------------------
  getFile(nameFile: string | File | null) {
    return this.http.get(`${this.apiUrl}${this.kanpeki}${this.files}/${nameFile}`, { responseType: 'blob', headers: { 'Authorization': 'Bearer ' + this.authS.getToken() } })
  }
  //--------------------------------------------------------------------------------------------------------------------------------------------

  //USER----------------------------------------------------------------------------------------------------------------------
  getUserMe(): Observable<ResponseUserDTO> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authS.getToken(),
      }),
    };
    return this.http.get<ResponseUserDTO>(
      `${this.apiUrl}${this.kanpeki}${this.users}/me`,
      this.httpOptions
    );
  }
  //---------------------------------------------------------------------------------------------------------------------------

  //WORD---------------------------------------------------------------------------------------------------------------------------------------
  getWordsByCategory(id: number): Observable<ResponseWordDTO[]> {
    return this.http.get<ResponseWordDTO[]>(
      `${this.apiUrl}${this.kanpeki}${this.words}/word/shuffle?categoryId=${id}`,
      this.httpOptions
    );
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------
  //QUESTIONS---------------------------------------------------------------------------------------------------------------------------------------
  getQuestionsByCategory(id: number): Observable<ResponseQuestionDTO[]> {
    return this.http.get<ResponseQuestionDTO[]>(
      `${this.apiUrl}${this.kanpeki}${this.questions}/question/shuffle?categoryId=${id}`,
      this.httpOptions
    );
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------

  //CATEGORY---------------------------------------------------------------------------------------------------------------------
  getCategories(): Observable<ResponseCategoryDTO[]> {
    return this.http.get<ResponseCategoryDTO[]>(
      `${this.apiUrl}${this.kanpeki}${this.categories}`,
      this.httpOptions
    );
  }
  //---------------------------------------------------------------------------------------------------------------------------
  //STATISTICS--------------------------------------------------------------------------------------------------------------
  getResultsUser(id: number): Observable<ResponseResultDTO[]> {
    return this.http.get<ResponseResultDTO[]>(
      `${this.apiUrl}${this.kanpeki}${this.results}/result/user?id=${id}`,
      this.httpOptions
    );
  }
  addResultsUser(result: RequestResultDTO): Observable<ResponseResultDTO[]> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
    return this.http.post<ResponseResultDTO[]>(
      `${this.apiUrl}${this.kanpeki}${this.results}/result`,
      result,
      this.httpOptions
    );
  }
  //---------------------------------------------------------------------------------------------------------------------
}
