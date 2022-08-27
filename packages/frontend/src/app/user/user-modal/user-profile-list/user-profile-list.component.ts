import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { UsersService } from '../../../shared/services/users.service';
import { UserProfile } from '../../../shared/models/user-profile.model';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { NotificationType } from '../../../shared/models/notification.model';
import { faUserCheck, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile-list',
  templateUrl: './user-profile-list.component.html',
})
export class UserProfileListComponent {
  @Output() profileSwitched = new EventEmitter<void>();
  @Input() profileList: UserProfile[] = [];

  selectedIcon = faUserCheck;
  addUserIcon = faUserPlus;

  defaultProfilePictureUrl = 'assets/img/avatar-blank.png';

  addProfileForm = new FormGroup({
    firstname: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(/\S/)])
    ),
    lastname: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(/\S/)])
    ),
    username: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(/\S/)])
    ),
  });

  get currentProfileId() {
    return this.auth.user?.profileUniqueId;
  }

  constructor(
    private readonly auth: AuthService,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationsService
  ) {}

  onCreateUser() {
    if (this.addProfileForm.valid) {
      this.usersService
        .createProfile(this.addProfileForm.value as any)
        .subscribe({
          next: (profile) => {
            this.addProfileForm.reset();
            this.profileList.push(profile);
            this.notificationService.push({
              type: NotificationType.Success,
              message: `Le profil ${profile.username} a été créé avec succès.`,
            });
          },
          error: () => {
            this.notificationService.push({
              type: NotificationType.Error,
              message: `Une erreur est survenue lors de la création du profil.`,
            });
          },
        });
    }
  }

  getProfilePictureUrl(profile: UserProfile) {
    return profile?.picture
      ? this.usersService.getProfilePictureUrl(profile.picture)
      : this.defaultProfilePictureUrl;
  }

  switchProfile(profile: UserProfile) {
    if (this.currentProfileId !== profile.profileUniqueId) {
      this.auth.switchUserProfile(profile.profileUniqueId).subscribe(() => {
        this.notificationService.push({
          type: NotificationType.Neutral,
          message: `Vous utilisez maintenant le profil: ${profile.username}`,
        });
        this.profileSwitched.emit();
      });
    }
  }
}
