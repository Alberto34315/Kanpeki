import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/admin/services/connection.service';
import { RequestUserDTO } from 'src/app/models/request/requestUserDTO';
import { ValidFormService } from 'src/app/services/valid-form.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {
  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i)]],
    fullName: ['', [Validators.required, Validators.maxLength(40)]],
    nickname: ['', [Validators.required, Validators.maxLength(40)]],
    birthday: ['', [Validators.required]],
    city: ['', [Validators.required, Validators.maxLength(40)]],
  });
  constructor(private authS: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private valiFormS: ValidFormService,) {
    this.valiFormS.myForm = this.myForm
  }
  ngOnInit(): void {
  }

  register() {
    let user: RequestUserDTO = this.myForm.value
    let fd = new FormData()
    fd.append('email', user.email)
    fd.append('password', user.password)
    fd.append('birthday', user.birthday)
    fd.append('city', user.city)
    fd.append('fullName', user.fullName)
    fd.append('nickname', user.nickname)
    fd.append('roles[]', "PENDING_APPROVAL")
    this.authS.register(fd).subscribe(res=>{
      this.router.navigateByUrl('/auth');
    })
  }

  fieldIsRequired(field: string) {
    return this.valiFormS.fieldIsRequired(field)
  }

  emailIsValid(field: string) {
    return this.valiFormS.emailIsValid(field)
  }

  passwordIsValid(field: string) {
    return this.valiFormS.passwordIsValid(field)
  }
  maxLengthdIsValid(field: string) {
    return this.valiFormS.maxLengthdIsValid(field)
  }
}
