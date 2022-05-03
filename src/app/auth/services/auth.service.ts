import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  setToken(token: string) {
    //localStorage.setItem("jwt", token)
    localStorage.setItem("jwt", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsib2F1dGgyLXJlc291cmNlIl0sInVzZXJfbmFtZSI6InNlbG1hLmhheW91bi5jYWJhbGxlcm9AZ21haWwuY29tIiwic2NvcGUiOlsicmVhZCJdLCJleHAiOjE2NTE2ODE4OTksImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1VTRVIiXSwianRpIjoiYWUzNTVmYjUtMjYxMy00MWY2LTk2ZTktZGQ4NWE5ZWM3ZDBkIiwiY2xpZW50X2lkIjoiS29reWFrdSJ9.wTNzi0US1NGvyFTqDv7SAX15edw5rjg8Vy5nPLDTFMU"
    )
  }

  getToken():string {
    return String(localStorage.getItem("jwt"))
  }
}
