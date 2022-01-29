import { LocalStorage } from '@ngx-pwa/local-storage';
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
import { map } from 'rxjs/operators';
import { AdminUserService } from './admin-User.service';

@Injectable({providedIn: 'root'})
export class AdminRouteGuard implements CanActivate {
  constructor(private userservice:AdminUserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;
    let roles = route.data["roles"] as Array<number>;
 

return  this.userservice.isAuth().pipe(
  map(data => {
  if (data&&(roles.includes(data.Role)))
   {
    return true;
  }
  else{  this.router.navigateByUrl('/admin-login'); return false;}  
  }));
      
  }

/*   canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
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
  } */

 
 /*  logOut() {

    this.localStorage.removeItem('custProfile').subscribe(() => { });
    this.localStorage.removeItem('AdminLoginData').subscribe(() => { });

    this.localStorage.removeItem('lang').subscribe(() => { });
    // this.localStorage.removeItem('selCustProf').subscribe(() => {});
    this.router.navigateByUrl('/admin-login');
   
  } */
}
