import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { BehaviorSubject, catchError, filter, of, tap } from 'rxjs';
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
  private _user$: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(AuthService.getUser());

  private _userChanged$ = new BehaviorSubject<User | null>(null);
  private _userAuthenticated$ = new BehaviorSubject<boolean>(false);

  get user(): User | null {
    return this._user$.value ? Object.assign({}, this._user$.value) : null;
  }

  get isAuthenticated(): boolean {
    return this._user$.value != null;
  }

  get isActivated(): boolean {
    return this._user$.value?.isActivated ?? false;
  }

  get isAdmin(): boolean {
    return this._user$.value?.isAdmin ?? false;
  }

  constructor(private readonly api: HttpClient) {
    this._user$.subscribe((user) => {
      if (!this._userChanged$.value && user) {
        this._userChanged$.next(user);
        this._userAuthenticated$.next(true);
      }
    });
  }

  initAuth() {
    return this.api.get<User>('auth/me', { withCredentials: true }).pipe(
      catchError(() => of(null)),
      tap((user) => this._user$.next(user)),
      tap((user) =>
        user ? AuthService.storeUser(user) : localStorage.removeItem('user')
      )
    );
  }

  googleAuthenticate(token: string) {
    return this.api
      .post<User>('google-auth', { token }, { withCredentials: true })
      .pipe(
        tap((user) => {
          this._user$.next(user);
          this._userAuthenticated$.next(true);
          AuthService.storeUser(user);
        })
      );
  }

  onUserUpdated() {
    return this._user$.asObservable();
  }

  onUserChanged() {
    return this._userChanged$.asObservable();
  }

  onUserAuthenticate() {
    return this._userAuthenticated$
      .asObservable()
      .pipe(filter((isAuthenticated) => isAuthenticated));
  }

  onUserDisconnected() {
    return this._userAuthenticated$
      .asObservable()
      .pipe(filter((isAuthenticated) => !isAuthenticated));
  }

  logout() {
    return this.api.get('auth/logout', { withCredentials: true }).pipe(
      tap(() => {
        this._user$.next(null);
        this._userAuthenticated$.next(false);
        localStorage.removeItem('user');
      })
    );
  }

  updateUserProfile(data: Partial<UserProfile>) {
    if (this._user$.value) {
      this._user$.next({
        ...this._user$.value,
        ...data,
      });
    }
  }

  switchUserProfile(profileUniqueId: string) {
    return this.api
      .get<User>(`auth/switchProfile/${profileUniqueId}`, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          this._user$.next(user);
          this._userChanged$.next(user);
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
          this._user$.next(user);
          this._userAuthenticated$.next(true);
          AuthService.storeUser(user);
        })
      );
  }

  register(data: registerDto) {
    return this.api
      .post<User>('auth/register', data, { withCredentials: true })
      .pipe(
        tap((user) => {
          this._user$.next(user);
          this._userAuthenticated$.next(true);
          AuthService.storeUser(user);
        })
      );
  }
}
