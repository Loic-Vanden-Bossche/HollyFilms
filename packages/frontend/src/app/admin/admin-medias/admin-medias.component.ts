import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';

@Component({
  selector: 'app-admin-medias',
  templateUrl: './admin-medias.component.html',
})
export class AdminMediasComponent implements OnInit {
  get medias() {
    return this.adminService.medias;
  }

  constructor(private readonly adminService: AdminService) {}

  ngOnInit(): void {
    this.medias.subscribe();
    this.adminService.getMedias().subscribe();
  }
}
