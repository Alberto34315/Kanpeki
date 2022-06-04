import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from '../shared/about-us/about-us.component';
import { HelpComponent } from '../shared/help/help.component';
import { ProfileComponent } from '../shared/profile/profile.component';
import { ListCategoriesComponent } from './pages/list-categories/list-categories.component';
import { ListQuestionsComponent } from './pages/list-questions/list-questions.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { ListWordsComponent } from './pages/list-words/list-words.component';
import { MainComponent } from './pages/main/main.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'statistics-admin',
        component: StatisticsComponent,
      },
      {
        path: 'categories',
        component: ListCategoriesComponent,
      },
      {
        path: 'questions',
        component: ListQuestionsComponent,
      },
      {
        path: 'words',
        component: ListWordsComponent,
      },
      {
        path: 'users',
        component: ListUsersComponent,
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
        redirectTo: 'statistics-admin',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
