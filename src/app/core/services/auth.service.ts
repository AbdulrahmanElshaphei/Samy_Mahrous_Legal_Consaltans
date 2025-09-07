import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Environment } from '../../Base/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private _HttpClient: HttpClient,
    private _Router: Router,
    @Inject(PLATFORM_ID) private platForm: object
  ) {
    if (isPlatformBrowser(this.platForm)) {
      const token = localStorage.getItem("userToken");
      if (token) {
        this.userInfo();
      }
    }
  }

  // Register and Verify and resendCode
  sendRegister(data: any): Observable<any> {
    return this._HttpClient.post(`${Environment.baseUrl}/api/Accounts/SignUp`, data);
  }

  verifyCode(data: any): Observable<any> {
    return this._HttpClient.post(
      `${Environment.baseUrl}/api/Accounts/signup/verify?email=${data.email}&code=${data.code}`,
      {}
    );
  }

  resendCode(data: any): Observable<any> {
    return this._HttpClient.post(
      `${Environment.baseUrl}/api/Accounts/signup/resend?email=${data.email}`,
      {}
    );
  }

  sendLogin(data: { email: string; password: string }): Observable<any> {
    return this._HttpClient.post(`${Environment.baseUrl}/api/Accounts/login`, data);
  }

  userInfo() {
    const token = localStorage.getItem("userToken");
    if (token) {
      this.userData.next(jwtDecode(token));
      console.log(this.userData.getValue());
    }
  }

  signout() {
    localStorage.removeItem("userToken");
    this.userData.next(null);
    this._Router.navigate(['/login']);
  }

  sendResetOtp(email: string): Observable<any> {
    return this._HttpClient.post(
      `${Environment.baseUrl}/api/Accounts/password/send-otp`,
      { email }
    );
  }

  verifyOtp(email: string, code: string): Observable<any> {
    return this._HttpClient.post(
      `${Environment.baseUrl}/api/Accounts/password/verify-otp`,
      { email, code }
    );
  }

  resetPassword(email: string, code: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this._HttpClient.post(
      `${Environment.baseUrl}/api/Accounts/password/reset`,
      { email, code, newPassword, confirmPassword }
    );
  }
}
