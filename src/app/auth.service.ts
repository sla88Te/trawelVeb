import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webService: WebRequestService, private router: Router, private http: HttpClient) { }

  public userEmail!: string;
  public isLoggedIn!: Promise<boolean>;

  

  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      shareReplay(),
      tap(async (res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        let x_access = res.headers.get('x-access-token') as string;
        let x_refresh = res.headers.get('x-refresh-token') as string;
        this.setSession(res.body._id, x_access, x_refresh, res.body.email);
        console.log("LOGGED IN!");
        console.log(res);
        console.log('ID:', res.body._id);
        console.log('Access:', localStorage.getItem('x-access-token'));
        console.log('Refresh:', localStorage.getItem('x-refresh-token'));
        console.log('UserID:', localStorage.getItem('user-id'));

        this.isLoggedIn = Promise.resolve(true);
        if(await this.isLoggedIn){
          this.userEmail = res.body.email;
          console.log(this.userEmail);
        }
        
      })
    )
  }

 
  signup(email: string, password: string, name: string, lastName: string, phoneNumber: string) {
    return this.webService.signup(email, password, name, lastName, phoneNumber).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        let x_access = res.headers.get('x-access-token') as string;
        let x_refresh = res.headers.get('x-refresh-token') as string
        this.setSession(res.body._id, x_access, x_refresh, res.body.email);
        console.log("Successfully signed up and now logged in!");
      })
    )
  }


  logout() {
    this.removeSession();
    this.isLoggedIn = Promise.resolve(false);
    this.router.navigate(['/']);
  }

  getEmail() {
    return localStorage.getItem('email')
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken)
  }
  
  private setSession(userId: string, accessToken: string, refreshToken: string, email: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
    localStorage.setItem('email', email)
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
    localStorage.removeItem('email');
  }

  getNewAccessToken() {
    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken() as string,
        '_id': this.getUserId() as string
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        let x_access = res.headers.get('x-access-token') as string;
        this.setAccessToken(x_access);
      })
    )
  }
}
