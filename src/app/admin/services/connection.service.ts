import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ResponseQuestionDTO } from 'src/app/models/response/responseQuestionDTO';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { ResponseWordDTO } from 'src/app/models/response/responseWordDTO';
import { api } from 'src/environments/api';

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

  constructor(private http: HttpClient) { }

  getUsers(): Observable<ResponseUserDTO[]> {
    return this.http.get<ResponseUserDTO[]>(`${this.apiUrl}${this.kanpeki}${this.users}`)
  }

  getWords(): Observable<ResponseWordDTO[]> {
    return this.http.get<ResponseWordDTO[]>(`${this.apiUrl}${this.kanpeki}${this.words}`)
  }

  getCategories(): Observable<ResponseCategoryDTO[]> {
    return this.http.get<ResponseCategoryDTO[]>(`${this.apiUrl}${this.kanpeki}${this.categories}`)
  }

  getQuestions(): Observable<ResponseQuestionDTO[]> {
    return this.http.get<ResponseQuestionDTO[]>(`${this.apiUrl}${this.kanpeki}${this.questions}`)
  }
}
