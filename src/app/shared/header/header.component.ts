import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/admin/services/connection.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  public headerRol:boolean=false
  public rol:string=""
  constructor( private router: Router,private connectionAdminService: ConnectionService) { }

  ngOnInit(): void {
    this.connectionAdminService.getUserMe().subscribe((res)=>{
      this.rol=res.roles[0]
      if(this.rol==="ADMIN"){
        this.headerRol=true
      }      
    })
  }

  goProfile() {
    if(this.rol==="ADMIN"){
      this.router.navigate(["./admin/profile"])
    }else{
      this.router.navigate(["./user/profile"])
    }
  }
}
