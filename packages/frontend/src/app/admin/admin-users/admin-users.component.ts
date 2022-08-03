import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];

  constructor(private readonly adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getUsers().subscribe((users) => (this.users = users));
  }
}
