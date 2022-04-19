import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [
    HeaderComponent,
    ProfileComponent
  ],
  exports: [HeaderComponent],
  imports: [
    CommonModule, RouterModule, TranslateModule
  ]
})
export class SharedModule { }
