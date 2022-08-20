import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { catchError, of, tap } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';

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

  constructor(private readonly api: HttpClient) {}

  initAuth() {
    return this.api.get<User>('auth/me', { withCredentials: true }).pipe(
      catchError(() => of(null)),
      tap((user) => (this._user = user)),
      tap((user) =>
        user ? AuthService.storeUser(user) : localStorage.removeItem('user')
      )
    );
  }

  get user(): User | null {
    return this._user ? Object.assign({}, this._user) : null;
  }

  get isAuthenticated(): boolean {
    return this._user != null;
  }

  get isActivated(): boolean {
    return this._user?.isActivated ?? false;
  }

  get isAdmin(): boolean {
    return this._user?.isAdmin ?? false;
  }

  logout() {
    return this.api.get('auth/logout', { withCredentials: true }).pipe(
      tap(() => {
        this._user = null;
        localStorage.removeItem('user');
      })
    );
  }

  updateUserProfile(data: UserProfile) {
    if (this._user) {
      this._user = {
        ...this._user,
        ...data,
      };
    }
  }

  switchUserProfile(profileUniqueId: string) {
    return this.api
      .get<User>(`auth/switchProfile/${profileUniqueId}`, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          this._user = user;
          AuthService.storeUser(user);
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
