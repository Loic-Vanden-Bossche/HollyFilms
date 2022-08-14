import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';
import { User } from '../../shared/models/user.model';
import { UsersService } from '../../shared/services/users.service';
import { BehaviorSubject, tap } from 'rxjs';
import { NotificationsService } from '../../shared/services/notifications.service';
import { NotificationType } from '../../shared/models/notification.model';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  users = new BehaviorSubject<User[]>([]);

  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UsersService,
    private readonly notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.adminService.getUsers().subscribe((users) => this.users.next(users));
  }

  onRejected(userId: string): void {
    this.userService
      .deleteUser(userId)
      .pipe(
        tap(() =>
          this.users.next(
            this.users.value.filter((user) => user._id !== userId)
          )
        )
      )
      .subscribe(() => {
        this.notificationsService.push({
          type: NotificationType.Success,
          message: `Utilisateur ${userId} rejeté`,
          lifetime: 3000,
        });
      });
  }

  onActivated(userId: string): void {
    this.userService
      .validateUser(userId)
      .pipe(
        tap(() =>
          this.users.next(
            this.users.value.map((user) => ({
              ...user,
              isActivated: user._id === userId || user.isActivated,
            }))
          )
        )
      )
      .subscribe(() => {
        this.notificationsService.push({
          type: NotificationType.Success,
          message: `Utilisateur ${userId} activé`,
          lifetime: 3000,
        });
      });
  }

  onDeleted(userId: string): void {
    this.userService
      .deleteUser(userId)
      .pipe(
        tap(() =>
          this.users.next(
            this.users.value.filter((user) => user._id !== userId)
          )
        )
      )
      .subscribe(() => {
        this.notificationsService.push({
          type: NotificationType.Success,
          message: `Utilisateur ${userId} supprimé`,
          lifetime: 3000,
        });
      });
  }
}
