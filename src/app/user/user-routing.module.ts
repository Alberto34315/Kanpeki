import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from '../shared/about-us/about-us.component';
import { HelpComponent } from '../shared/help/help.component';
import { ProfileComponent } from '../shared/profile/profile.component';
import { MainComponent } from './pages/main/main.component';
import { StatisticsUserComponent } from './pages/statistics-user/statistics-user.component';
import { StudyUserComponent } from './pages/study-user/study-user.component';
import { TestsUserComponent } from './pages/tests-user/tests-user.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'statistics-user',
        component: StatisticsUserComponent,
      },
      {
        path: 'study-user',
        component: StudyUserComponent,
      },
      {
        path: 'tests-user',
        component: TestsUserComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'aboutUs',
        component: AboutUsComponent,
      },
      {
        path: 'help',
        component: HelpComponent,
      },
      {
        path: '**',
        redirectTo: 'statistics-user',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
