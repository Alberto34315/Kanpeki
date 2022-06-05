import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { LanguageService } from './language.service';
@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  constructor(private lgS: LanguageService) { }

  showErrorCredentials(err: HttpErrorResponse) {
    if (err.status == 400 || err.status == 401) {
      Swal.fire('Error', this.lgS.getTextByKey("msg.errorCredentials"), 'error');
    } else if (err.status == 403) {
      Swal.fire('Error', this.lgS.getTextByKey("msg.errorAccess"), 'error');
    }
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

  showCreateUser() {
   return Swal.fire(this.lgS.getTextByKey("msg.createUser"), '', 'success');
  }

  showErrorImage() {
    Swal.fire('Error', this.lgS.getTextByKey("msg.errorImage"), 'error');
  }

  showErrorRepeatPass() {
    Swal.fire('Error', this.lgS.getTextByKey("form.repeatPassword"), 'error');
  }

  showMsgWarningStudyTest() {
    Swal.fire('Error', this.lgS.getTextByKey("msg.errorStudyTest"), 'warning');
  }

  showMsgScore1() {
    Swal.fire(this.lgS.getTextByKey("msg.score1"), '', 'error');
  }
  showMsgScore2() {
    Swal.fire(this.lgS.getTextByKey("msg.score2"), '', 'warning');
  }
  showMsgScore3() {
    Swal.fire(this.lgS.getTextByKey("msg.score3"), '', 'success');
  }
  showMsgScore4() {
    Swal.fire(this.lgS.getTextByKey("msg.score4"), '', 'success');
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
