import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidTokenGuard implements CanActivate, CanLoad {
  constructor(private authS: AuthService,
    private router: Router) { }

  canActivate(): Observable<boolean> | boolean {
    return this.authS.validarToken()
      .pipe(
        tap(valid => {
          if (!valid) {
            this.router.navigateByUrl('/auth');
          }
        })
      )
  }

  canLoad(): Observable<boolean> | boolean {
    return this.authS.validarToken().pipe(
      tap(valid => {
        if (!valid) {
          this.router.navigateByUrl('/auth');
        }
      })
    )
  }
}
