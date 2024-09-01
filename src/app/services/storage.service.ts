import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private get windowRef(): any {
    return typeof window !== 'undefined' ? window : null;
  }

  constructor() { }

  public getToken(): any {
    const user = this.windowRef?.sessionStorage.getItem(USER_KEY);
    if (user) {
      const userToken = JSON.parse(user);
      return userToken.jwtToken;
    }
    return {};
  }

  clean(): void {
    this.windowRef?.sessionStorage.clear();
  }

  public saveUser(allData: any): void {
    this.windowRef?.sessionStorage.removeItem("auth-user");
    this.windowRef?.sessionStorage.setItem("auth-user", JSON.stringify(allData));
  }

  public getUser(): any {
    const user = this.windowRef?.sessionStorage.getItem(USER_KEY);
    if (user) {
      const userData = JSON.parse(user);
      // console.log("Mehedi --", JSON.parse(user));
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(userData.jwtToken);
      // console.log("decodedToken --", decodedToken);

      const expirationDate = helper.getTokenExpirationDate(userData.jwtToken);
      // console.log("expirationDate --", expirationDate);
      const isExpired = helper.isTokenExpired(userData.jwtToken);
      // console.log("isExpired --", isExpired);

      return decodedToken;
    }
    return {};
  }

  public isLoggedIn(): boolean {
    const user = this.windowRef?.sessionStorage.getItem('auth-user');
    return !!user;
  }
}
