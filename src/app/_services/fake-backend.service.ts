import { Injectable } from '@angular/core';
import { HttpResponse, HttpRequest, HttpEvent, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize, first } from 'rxjs/operators';

import { AuthenticationService } from './';
import { User, Role } from '../_models';


@Injectable()
export class FakeBackendService implements HttpInterceptor {

  currentUser;

  constructor(private authService: AuthenticationService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const users: User[] = [
      {id: 1, username: 'admin', password: 'admin123', firstName: 'Admin', lastName: 'User', role: Role.Admin},
      {id: 2, username: 'user', password: 'user123', firstName: 'Normal', lastName: 'User', role: Role.User}
    ];
    const authHeader = request.headers.get('Authorization');
    const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');
    const roleString = isLoggedIn && authHeader.split('.')[1];
    const role = roleString ? Role[roleString] : null;
    
    return of(null).pipe(mergeMap(() => {

      if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                const user = users.find(x => x.username === request.body.username && x.password === request.body.password);
                if (!user) return error('Username or password is incorrect');

                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    token: `fake-jwt-token.${user.role}`
                });
            }
            this.authService.currentUser.pipe(first()).subscribe(x => this.currentUser = x);
            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                //if (!isLoggedIn) return unauthorised();
                let urlParts = request.url.split('/');
                let id = parseInt(urlParts[urlParts.length - 1]);

                if (id !== this.currentUser.id && this.currentUser.role !== Role.Admin) return unauthorised();

                const user = users.find(x => x.id === id);
                return ok(user);
            }

            if (request.url.endsWith('/users') && request.method === 'GET') {
                if (this.currentUser.role !== Role.Admin) return unauthorised();
                return ok(users);
            }

            return next.handle(request);
    } )).pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }
  }

}

export let FakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendService,
    multi: true
};