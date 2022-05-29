import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { ConnectionService } from 'src/app/admin/services/connection.service';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { ValidFormService } from 'src/app/services/valid-form.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i)]],
  });
  public load: boolean = false;
  constructor(private authS: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private valiFormS: ValidFormService,
    private connectionSAdmin: ConnectionService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) {
    this.valiFormS.myForm = this.myForm
  }


  ngOnInit(): void {

  }

  login() {
    //selma.hayoun.caballero@gmail.com
    //C4c4hu3t3!!

    //aaaaa@gmail.com
    //C4c4hu3t3$$
    //Qwerty_343

    //ccccc@gmail.com
    //C4c4hu3t3**
    let email = this.myForm.value.email
    let pass = this.myForm.value.password
    this.authS.login(email, pass)
      .pipe(tap({
        next: (res) => {
          this.load = true
          this.cdRef.markForCheck()
          this.authS.setToken(res.access_token)
          this.getUser()
        },
        error: (err) => {
          // this.load = true
          this.errorMsgS.showErrorCredentials(err)
          this.cdRef.markForCheck()
        }
      }),
        finalize(() => {
          setTimeout(() => {
            this.load = false
          }, 500)
        }))
      .subscribe(
        (res) => {
        })
  }

  getUser() {
    this.connectionSAdmin.getUserMe()
    .pipe(tap({
      next: (res) => {
        this.load = true
        if (res.roles[0] === "ADMIN") {
          this.router.navigateByUrl('/admin');
        } else if (res.roles[0] === "USER") {
          this.router.navigateByUrl('/user');
        }
        this.cdRef.markForCheck()
      },
      error: (err) => {
        this.load = true
        this.errorMsgS.showErrorCredentials(err)
        this.cdRef.markForCheck()
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

  fieldIsRequired(field: string) {
    return this.valiFormS.fieldIsRequired(field)
  }

  emailIsValid(field: string) {
    return this.valiFormS.emailIsValid(field)
  }

  passwordIsValid(field: string) {
    return this.valiFormS.passwordIsValid(field)
  }
}
