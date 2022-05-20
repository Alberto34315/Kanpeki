import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { LanguageService } from './language.service';
@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  constructor(private lgS: LanguageService) { }

  showErrorMessage() {
    Swal.fire('Error', this.lgS.getTextByKey("msg.errorCredentials"), 'error');
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
