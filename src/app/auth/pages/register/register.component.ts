import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { RequestUserDTO } from 'src/app/models/request/requestUserDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
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
    email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i)]],
    password2: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i)]],
    fullName: ['', [Validators.required, Validators.maxLength(40)]],
    nickname: ['', [Validators.required, Validators.maxLength(40)]],
    birthday: ['', [Validators.required]],
    city: ['', [Validators.required, Validators.maxLength(40)]],
  });
  public load: boolean = false;
  constructor(private authS: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private valiFormS: ValidFormService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) {
    this.valiFormS.myForm = this.myForm
  }
  ngOnInit(): void {
  }

  register() {
    if (this.samePass()) {
      this.errorMsgS.showErrorRepeatPass()
    } else {
      let user: RequestUserDTO = this.myForm.value
      let fd = new FormData()
      fd.append('email', user.email)
      fd.append('password', user.password)
      fd.append('birthday', user.birthday)
      fd.append('city', user.city)
      fd.append('fullName', user.fullName)
      fd.append('nickname', user.nickname)
      fd.append('roles[]', "PENDING_APPROVAL")

      this.authS.register(fd)
        .pipe(tap({
          next: (res) => {
            this.load = true
            this.cdRef.markForCheck()
            this.router.navigateByUrl('/auth');
          },
          error: (err) => {
            this.load = true
            this.cdRef.markForCheck()
            this.errorMsgS.showErrorMessage(err)
          }
        }),
          finalize(() => {
            setTimeout(() => {
              this.load = false
            }, 300)
          }))
        .subscribe(res => {
        })
    }
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

  samePass() {
    return (this.myForm.get("password")?.value !== this.myForm.get("password2")?.value)
  }
}
