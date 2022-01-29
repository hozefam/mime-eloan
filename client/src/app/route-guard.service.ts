import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { NbAuthService } from "@nebular/auth";
import { tap } from "rxjs/operators/tap";

@Injectable()
export class RouteGuard implements CanActivate, CanActivateChild {
  constructor(private authService: NbAuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;
    return this.authService.isAuthenticated().pipe(
      tap(authenticated => {
        if (!authenticated) {
          this.authService.getToken().subscribe(token => {
            if (!token.getValue()) this.router.navigateByUrl("/auth/login");
            else if (!token.isValid()) {
              this.authService.refreshToken("email", { data: token }).subscribe(
                res => {
                  if (!res.isSuccess()) this.logOut();
                  else this.router.navigateByUrl(url);
                },
                err => {
                  this.router.navigateByUrl("/auth/login");
                }
              );
            }
          });
        }
      })
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;
    return this.authService.isAuthenticated().pipe(
      tap(authenticated => {
        if (!authenticated) {
          this.authService.getToken().subscribe(token => {
            if (!token.getValue()) this.router.navigateByUrl("/auth/login");
            else if (!token.isValid()) {
              this.authService.refreshToken("email", { data: token }).subscribe(
                res => {
                  if (!res.isSuccess()) this.logOut();
                  else this.router.navigateByUrl(url);
                },
                err => {
                  this.router.navigateByUrl("/auth/login");
                }
              );
            }
          });
        }
      })
    );
  }

  logOut() {
    this.authService.logout("email").subscribe(result => {
      let message, error;
      if (result.isSuccess()) {
        message = result.getMessages();
      } else {
        error = result.getErrors();
      }
      var redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, 300);
      }
    });
  }
}
