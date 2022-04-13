import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidTokenGuard } from './guards/valid-token.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
        canActivate: [ValidTokenGuard],
        canLoad: [ValidTokenGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
        canActivate: [ValidTokenGuard],
        canLoad: [ValidTokenGuard],
      },
      {
        path: '**',
        redirectTo: 'auth',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
