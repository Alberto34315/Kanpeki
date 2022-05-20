import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { LanguageService } from './language.service';
@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  constructor(private lgS: LanguageService) { }

  showErrorCredentials() {
    Swal.fire('Error', this.lgS.getTextByKey("msg.errorCredentials"), 'error');
  }
  showErrorMessage(err: HttpErrorResponse) {
    if (err.error.errors.length === 0) {
      Swal.fire('Error', err.error.msg, 'error');
    } else {
      let element = ""
      for (let i = 0; i < err.error.errors.length; i++) {
        element += "<div class='border-bottom'>" + err.error.errors[i] + "</div><br>";
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        html: `<div>${element}</div>`
      });
    }

  }
  showErrorImage() {
    Swal.fire('Error', this.lgS.getTextByKey("msg.errorImage"), 'error');
  }

  deleteElement() {
    return Swal.fire({
      title: this.lgS.getTextByKey("msg.deleteTitle"),
      text: this.lgS.getTextByKey("msg.deleteText"),
      icon: 'warning',
      focusCancel: true,
      showCancelButton: true,
      confirmButtonColor: '#eb6864',
      cancelButtonColor: '#C984FF',
      confirmButtonText: this.lgS.getTextByKey("msg.confirmBtn"),
      cancelButtonText: this.lgS.getTextByKey("msg.cancelBtn"),
    })
  }
}
