import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestUserDTO } from 'src/app/models/request/requestUserDTO';
import { RequestWordDTO } from 'src/app/models/request/requestWordDTO';
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
  private files: string = api.files

  constructor(private http: HttpClient) { }

  //FILE---------------------------------------------------------------------------------------------------------------------
  getFile(nameFile: string | File | null) {
    return this.http.get(`${this.apiUrl}${this.kanpeki}${this.files}/${nameFile}`, { responseType: 'blob' })
  }
  //---------------------------------------------------------------------------------------------------------------------
  
  //USER----------------------------------------------------------------------------------------------------------------------
  getUsers(): Observable<ResponseUserDTO[]> {
    return this.http.get<ResponseUserDTO[]>(`${this.apiUrl}${this.kanpeki}${this.users}`)
  }

  addUser(user: FormData): Observable<RequestUserDTO> {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Headers': 'Content-Type',
    //     'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    //     'Content-Type': 'multipart/form-data',
    //     "Accept": 'application/json',
    //     'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2F1dGgyLXJlc291cmNlIl0sInVzZXJfbmFtZSI6InNlbG1hLmhheW91bi5jYWJhbGxlcm9AZ21haWwuY29tIiwic2NvcGUiOlsicmVhZCJdLCJleHAiOjE2NTA5OTU4NTYsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiIsIlJPTEVfQURNSU4iXSwianRpIjoiOGNhNmM0ZGEtOWFjMS00ODM5LWI0OGMtYTFlYzJjNTk1MmI0IiwiY2xpZW50X2lkIjoiS29reWFrdSJ9.VmvF0B74MN5EpIgL06YnVcaVpUhIWJk48CL-onmqqec"
    //   })
    // }
    return this.http.post<RequestUserDTO>(`${this.apiUrl}${this.kanpeki}${this.users}/user/v2`, user)
  }

  updateUser(id: number, user: FormData): Observable<ResponseUserDTO> {
    return this.http.put<ResponseUserDTO>(`${this.apiUrl}${this.kanpeki}${this.users}/user/v2/${id}`, user)
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${this.kanpeki}${this.users}/user/${id}`)
  }
  //-------------------------------------------------------------------------------------------------------------------

  //WORD--------------------------------------------------------------------------------------------------------------
  getWords(): Observable<ResponseWordDTO[]> {
    return this.http.get<ResponseWordDTO[]>(`${this.apiUrl}${this.kanpeki}${this.words}`)
  }

  addWord(word: FormData): Observable<RequestWordDTO> {
    return this.http.post<RequestWordDTO>(`${this.apiUrl}${this.kanpeki}${this.words}/word/v2`, word)
  }

  updateWord(id: number, word: FormData): Observable<RequestWordDTO> {
    return this.http.put<RequestWordDTO>(`${this.apiUrl}${this.kanpeki}${this.words}/word/v2/${id}`, word)
  }

  deleteWords(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${this.kanpeki}${this.words}/word/${id}`)
  }
  //---------------------------------------------------------------------------------------------------------------------

  //CATEGORY---------------------------------------------------------------------------------------------------------------------
  getCategories(): Observable<ResponseCategoryDTO[]> {
    return this.http.get<ResponseCategoryDTO[]>(`${this.apiUrl}${this.kanpeki}${this.categories}`)
  }
  //---------------------------------------------------------------------------------------------------------------------

  //QUESTION---------------------------------------------------------------------------------------------------------------------
  getQuestions(): Observable<ResponseQuestionDTO[]> {
    return this.http.get<ResponseQuestionDTO[]>(`${this.apiUrl}${this.kanpeki}${this.questions}`)
  }
  //---------------------------------------------------------------------------------------------------------------------
}
