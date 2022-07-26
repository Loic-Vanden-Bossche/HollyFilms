import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { tap } from 'rxjs';

export interface registerDto {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  username?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: User | null = AuthService.getUser();

  constructor(private api: HttpClient) {
    this.api.get<User>('auth/me', { withCredentials: true }).subscribe({
      next: (user) => {
        this._user = user;
        AuthService.storeUser(user);
      },
      error: () => {
        this._user = null;
        localStorage.removeItem('user');
      },
    });
  }

  get user(): User {
    return Object.assign({}, this._user);
  }

  get isAuthenticated(): boolean {
    return this._user != null;
  }

  logout() {
    return this.api.get('auth/logout', { withCredentials: true }).pipe(
      tap(() => {
        this._user = null;
        localStorage.removeItem('user');
      })
    );
  }

  private static getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private static storeUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  authenticate(email: string, password: string) {
    return this.api
      .post<User>('auth/login', { email, password }, { withCredentials: true })
      .pipe(
        tap((user) => {
          this._user = user;
          AuthService.storeUser(user);
        })
      );
  }

  register(data: registerDto) {
    return this.api
      .post<User>('auth/register', data, { withCredentials: true })
      .pipe(
        tap((user) => {
          this._user = user;
          AuthService.storeUser(user);
        })
      );
  }
}
