import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';
import { NotificationsService } from '../../shared/services/notifications.service';
import { NotificationType } from '../../shared/models/notification.model';
import { tap } from 'rxjs';
import { SearchService } from '../../shared/services/search.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  get filteredUsers() {
    return this.adminService.filteredUsers;
  }

  constructor(
    private readonly adminService: AdminService,
    private readonly notificationsService: NotificationsService,
    private readonly searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchService
      .onChange()
      .pipe(tap((query) => this.adminService.filterUsers(query)))
      .subscribe();

    if (this.adminService.users.length === 0) {
      this.adminService.getUsers().subscribe();
    }
  }

  onRejected(userId: string): void {
    this.adminService.deleteUser(userId).subscribe(() => {
      this.notificationsService.push({
        type: NotificationType.Success,
        message: `Utilisateur ${userId} rejeté`,
        lifetime: 3000,
      });
    });
  }

  onActivated(userId: string): void {
    this.adminService.validateUser(userId).subscribe(() => {
      this.notificationsService.push({
        type: NotificationType.Success,
        message: `Utilisateur ${userId} activé`,
        lifetime: 3000,
      });
    });
  }

  onDeleted(userId: string): void {
    this.adminService.deleteUser(userId).subscribe(() => {
      this.notificationsService.push({
        type: NotificationType.Success,
        message: `Utilisateur ${userId} supprimé`,
        lifetime: 3000,
      });
    });
  }
}
