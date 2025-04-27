import { Injectable } from "@angular/core";
import { CanActivate,Router } from "@angular/router";
import { json } from "stream/consumers";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = typeof window !== 'undefined'?localStorage.getItem('token'):null;
    const userJson = typeof window !=='undefined' ?localStorage.getItem('user'):null;
        if (token&&userJson) {
          var user =JSON.parse(userJson);
          if (!user.roles.includes('Admin'))
            return true;
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}
