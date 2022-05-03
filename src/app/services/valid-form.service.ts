import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidFormService {
  public myForm!: FormGroup
  constructor() { }


  fieldIsRequired(field: string) {
    return (
      this.myForm.controls[field].hasError('required') &&
      this.myForm.controls[field].touched
    );
  }

  emailIsValid(field: string) {
    return (
      this.myForm.controls[field].hasError('email') &&
      this.myForm.controls[field].touched
    );
  }

  passwordIsValid(field: string) {
    return (
      this.myForm.controls[field].hasError('pattern') &&
      this.myForm.controls[field].touched
    );
  }

  maxLengthdIsValid(field: string) {
    return (
      this.myForm.controls[field].hasError('maxlength') &&
      this.myForm.controls[field].touched
    );
  }
}
