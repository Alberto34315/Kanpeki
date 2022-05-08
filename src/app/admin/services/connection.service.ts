import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RequestCategoryDTO } from 'src/app/models/request/requestCategoryDTO';
import { RequestQuestionDTO } from 'src/app/models/request/requestQuestionDTO';
import { ResponseResultDTO } from 'src/app/models/request/requestResultDTO';
import { RequestUserDTO } from 'src/app/models/request/requestUserDTO';
import { RequestWordDTO } from 'src/app/models/request/requestWordDTO';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ResponseQuestionDTO } from 'src/app/models/response/responseQuestionDTO';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { ResponseWordDTO } from 'src/app/models/response/responseWordDTO';
import { api } from 'src/environments/api';
import { formatDate } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeES, 'es');

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private apiUrl: string = api.apiUrl
  private kanpeki: string = api.kanpeki
  private users: string = api.user
  private words: string = api.word
  private categories: string = api.category
  private questions: string = api.question
  private files: string = api.files
  private results: string = api.result
  private httpOptions
  constructor(private http: HttpClient, private authS: AuthService) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
  }

  //FILE---------------------------------------------------------------------------------------------------------------------
  getFile(nameFile: string | File | null) {
    return this.http.get(`${this.apiUrl}${this.kanpeki}${this.files}/${nameFile}`, { responseType: 'blob', headers: { 'Authorization': 'Bearer ' + this.authS.getToken() } })
  }
  //---------------------------------------------------------------------------------------------------------------------

  //USER----------------------------------------------------------------------------------------------------------------------
  getUsers(): Observable<ResponseUserDTO[]> {
    return this.http.get<ResponseUserDTO[]>(`${this.apiUrl}${this.kanpeki}${this.users}`, this.httpOptions)
  }

  getUserMe(): Observable<ResponseUserDTO> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
    return this.http.get<ResponseUserDTO>(`${this.apiUrl}${this.kanpeki}${this.users}/me`, this.httpOptions)
  }

  getUserById(id: number): Observable<ResponseUserDTO> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
    return this.http.get<ResponseUserDTO>(`${this.apiUrl}${this.kanpeki}${this.users}/user?id=` + id, this.httpOptions)
  }

  addUser(user: FormData): Observable<RequestUserDTO> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
    return this.http.post<RequestUserDTO>(`${this.apiUrl}${this.kanpeki}${this.users}/user/v2`, user, this.httpOptions)
  }

  updateUser(id: number, user: FormData): Observable<ResponseUserDTO> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
    return this.http.put<ResponseUserDTO>(`${this.apiUrl}${this.kanpeki}${this.users}/user/v2/${id}`, user, this.httpOptions)
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${this.kanpeki}${this.users}/user/${id}`, this.httpOptions)
  }
  //-------------------------------------------------------------------------------------------------------------------

  //WORD--------------------------------------------------------------------------------------------------------------
  getWords(): Observable<ResponseWordDTO[]> {
    return this.http.get<ResponseWordDTO[]>(`${this.apiUrl}${this.kanpeki}${this.words}`, this.httpOptions)
  }

  addWord(word: FormData): Observable<RequestWordDTO> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
    return this.http.post<RequestWordDTO>(`${this.apiUrl}${this.kanpeki}${this.words}/word/v2`, word, this.httpOptions)
  }

  updateWord(id: number, word: FormData): Observable<RequestWordDTO> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
    return this.http.put<RequestWordDTO>(`${this.apiUrl}${this.kanpeki}${this.words}/word/v2/${id}`, word, this.httpOptions)
  }

  deleteWords(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${this.kanpeki}${this.words}/word/${id}`, this.httpOptions)
  }
  //---------------------------------------------------------------------------------------------------------------------

  //CATEGORY---------------------------------------------------------------------------------------------------------------------
  getCategories(): Observable<ResponseCategoryDTO[]> {
    return this.http.get<ResponseCategoryDTO[]>(`${this.apiUrl}${this.kanpeki}${this.categories}`, this.httpOptions)
  }

  addCategory(category: RequestCategoryDTO): Observable<ResponseCategoryDTO> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
    return this.http.post<ResponseCategoryDTO>(`${this.apiUrl}${this.kanpeki}${this.categories}/category`, category, this.httpOptions)
  }

  updatCategory(id: number, category: RequestCategoryDTO): Observable<ResponseCategoryDTO> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
    return this.http.put<ResponseCategoryDTO>(`${this.apiUrl}${this.kanpeki}${this.categories}/category/${id}`, category, this.httpOptions)
  }

  deleteCategories(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${this.kanpeki}${this.categories}/category/${id}`, this.httpOptions)
  }
  //---------------------------------------------------------------------------------------------------------------------

  //QUESTION---------------------------------------------------------------------------------------------------------------------
  getQuestions(): Observable<ResponseQuestionDTO[]> {
    return this.http.get<ResponseQuestionDTO[]>(`${this.apiUrl}${this.kanpeki}${this.questions}`, this.httpOptions)
  }

  addQuestion(question: RequestQuestionDTO): Observable<ResponseQuestionDTO> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
    return this.http.post<ResponseQuestionDTO>(`${this.apiUrl}${this.kanpeki}${this.questions}/question`, question, this.httpOptions)
  }

  updatQuestion(id: number, question: RequestQuestionDTO): Observable<ResponseQuestionDTO> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.authS.getToken()
      })
    }
    return this.http.put<ResponseQuestionDTO>(`${this.apiUrl}${this.kanpeki}${this.questions}/question/${id}`, question, this.httpOptions)
  }

  deleteQuestions(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${this.kanpeki}${this.questions}/question/${id}`, this.httpOptions)
  }
  //---------------------------------------------------------------------------------------------------------------------

  //STATISTICS--------------------------------------------------------------------------------------------------------------
  getResults(): Observable<ResponseResultDTO[]> {
    return this.http.get<ResponseResultDTO[]>(`${this.apiUrl}${this.kanpeki}${this.results}`, this.httpOptions)
  }
  getResultsBetweenDates(): Observable<ResponseResultDTO[]> {
    // let startDate = new Date();
    // let startDateFormat = formatDate(startDate, 'YYYY-MM-dd', 'es');
    // let endDate = new Date();
    // endDate.setDate(new Date().getDate() + 6);
    // let endDateFormat = formatDate(endDate, 'YYYY-MM-dd', 'es');
    
    // return this.http.get<ResponseResultDTO[]>(`${this.apiUrl}${this.kanpeki}${this.results}/result/search?endDate=${endDateFormat}&startDate=${startDateFormat}`, this.httpOptions)
    return this.http.get<ResponseResultDTO[]>(`${this.apiUrl}${this.kanpeki}${this.results}/result/search?endDate=${'2022-01-17'}&startDate=${'2022-01-10'}`, this.httpOptions)
  }
  getResultsCustomData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${this.kanpeki}${this.results}/custom`, this.httpOptions)
  }
  //---------------------------------------------------------------------------------------------------------------------
}
