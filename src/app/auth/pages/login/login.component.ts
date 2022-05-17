import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/admin/services/connection.service';
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

  constructor(private authS: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private valiFormS: ValidFormService,
    private connectionSAdmin: ConnectionService) {
    this.valiFormS.myForm = this.myForm
  }


  ngOnInit(): void {

  }

  login() {
    //selma.hayoun.caballero@gmail.com
    //C4c4hu3t3!!

    //admin@gmail.com
    //Qwerty_343
    
    //ccccc@gmail.com
    //C4c4hu3t3**
    let email = this.myForm.value.email
    let pass = this.myForm.value.password
    this.authS.login(email, pass).subscribe(res => {
      this.authS.setToken(res.access_token)    
      this.getUser()
    })
  }

  getUser() {
    this.connectionSAdmin.getUserMe().subscribe(res => {
      if (res.roles[0] === "ADMIN") {
        this.router.navigateByUrl('/admin');
      } else if (res.roles[0] === "USER") {
        this.router.navigateByUrl('/user');
      }
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
