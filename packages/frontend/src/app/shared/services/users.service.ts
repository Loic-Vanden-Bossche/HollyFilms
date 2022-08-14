import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdateUserDTO, User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private api: HttpClient) {}

  getCurrentUser() {
    return this.api.get<User>(`auth/me`, {
      withCredentials: true,
    });
  }

  getUser(userId: string): Observable<User> {
    return this.api.get<User>(`users/limited/${userId}`, {
      withCredentials: true,
    });
  }

  saveUser(user: UpdateUserDTO) {
    return this.api.put<User>('users/me', user, {
      withCredentials: true,
    });
  }

  refuseUser(userId: string) {
    return this.api.get<User>(`users/admin/refuse/${userId}`, {
      withCredentials: true,
    });
  }

  validateUser(userId: string) {
    return this.api.get<User>(`users/admin/activate/${userId}`, {
      withCredentials: true,
    });
  }

  deleteUser(userId: string) {
    return this.api.delete<User>(`users/admin/${userId}`, {
      withCredentials: true,
    });
  }
}
