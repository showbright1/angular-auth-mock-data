import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let user = this.authService.currentUserValue;
    if(user) {
      if(route.data.roles && route.data.roles.indexOf(user.role) === -1) {
        this.router.navigate(['/']);
        return false;
      }

      return true;
    }
    
    this.router.navigate(['login'], {queryParams: {returnURL: state.url}});
    return false;
  }

}