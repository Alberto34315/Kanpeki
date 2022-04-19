import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsUserComponent } from './pages/statistics-user/statistics-user.component';
import { StudyUserComponent } from './pages/study-user/study-user.component';
import { TestsUserComponent } from './pages/tests-user/tests-user.component';

const routes: Routes = [
  {
    path: '',
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
        component: TestsUserComponent,
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
