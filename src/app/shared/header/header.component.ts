import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit(): void {
  }

  goProfile() {
    this.router.navigate(["./admin/profile"])
  }
}
