import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdateUserDTO, User } from '../models/user.model';
import { map, Observable, switchMap } from 'rxjs';
import { Degree, DegreeDTO } from '../models/degree.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private api: HttpClient) {}

  // TODO: refactor
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

  getAllDegrees(userId: string) {
    return this.api.get<Degree[]>(`degrees/${userId}`, {
      withCredentials: true,
    });
  }

  addDegree(degreeDTO: DegreeDTO) {
    return this.api
      .post<Degree>(
        'degrees/teacher-add-degree',
        {
          name: degreeDTO.name,
          graduation: degreeDTO.graduation,
        },
        {
          withCredentials: true,
        }
      )
      .pipe(
        switchMap((createdDegree) =>
          this.uploadDegreeFile(
            createdDegree._id || '',
            degreeDTO.file as File
          ).pipe(map(() => createdDegree))
        )
      );
  }

  uploadDegreeFile(degreeId: string, file: File) {
    const formData = new FormData();
    formData.append('degreeDocument', file);
    return this.api.post<void>(
      `degrees/degree-document/${degreeId}`,
      formData,
      {
        withCredentials: true,
      }
    );
  }

  deleteDegree(degreeId: string) {
    return this.api.delete(`degrees/teacher-remove-degree/${degreeId}`, {
      withCredentials: true,
    });
  }

  isUserVerified(userId: string) {
    return this.api.get<boolean>(`degrees/is-verified/${userId}`, {
      withCredentials: true,
    });
  }

  uploadPicFile(file: File) {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return this.api.post<void>(`users/profile-picture`, formData, {
      withCredentials: true,
    });
  }

  downloadDegree(degreeId: string) {
    return this.api.get<BlobPart>(`degrees/degree-document/${degreeId}`, {
      withCredentials: true,
      responseType: 'blob' as 'json',
    });
  }
}
