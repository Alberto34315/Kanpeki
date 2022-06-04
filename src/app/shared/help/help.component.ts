import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.sass']
})
export class HelpComponent implements OnInit {
  public admin: boolean = false
  constructor(private router: Router) {
    if (this.router.url.includes("admin")) {
      this.admin = true
    }

  }

  ngOnInit(): void {
  }

}
