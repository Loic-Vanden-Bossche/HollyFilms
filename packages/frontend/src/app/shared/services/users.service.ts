import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdateUserDTO, User } from '../models/user.model';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';
import { ProfileInsights } from '../models/profile-Insights.model';
import { TMDBMicroSearchResult } from '../models/micro-tmdb-search-result.model';
import { MediaType } from '../models/media.model';

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

  getProfileList() {
    return this.api.get<UserProfile[]>(`users/profiles`, {
      withCredentials: true,
    });
  }

  uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return this.api.post<UserProfile>(`users/profile-picture`, formData, {
      withCredentials: true,
    });
  }

  updateProfile(profileUniqueId: string, profile: Partial<UserProfile>) {
    return this.api.put<UserProfile>(
      `users/profile/${profileUniqueId}`,
      profile,
      {
        withCredentials: true,
      }
    );
  }

  deleteProfile() {
    return this.api.delete<User>(`users/profile`, {
      withCredentials: true,
    });
  }

  requestMedia(tmdbId: number, mediaType: MediaType) {
    return this.api.get<TMDBMicroSearchResult>(
      `users/addRequest/${mediaType}/${tmdbId}`,
      {
        withCredentials: true,
      }
    );
  }

  createProfile(data: {
    firstName: string;
    lastName: string;
    username: string;
  }) {
    return this.api.post<UserProfile>(`users/profile`, data, {
      withCredentials: true,
    });
  }

  getUser(userId: string): Observable<User> {
    return this.api.get<User>(`users/limited/${userId}`, {
      withCredentials: true,
    });
  }

  getProfileInsights(profileUniqueId: string) {
    return this.api.get<ProfileInsights>(`users/insights/${profileUniqueId}`, {
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
