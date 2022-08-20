import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { faUserPen, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { NotificationsService } from '../../shared/services/notifications.service';
import { NotificationType } from '../../shared/models/notification.model';
import { UserProfile } from '../../shared/models/user-profile.model';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  animations: [
    trigger('animateLeft', [
      transition(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'translateX(-10%)',
          }),
          animate(
            '1s {{delay}}ms ease',
            style({
              opacity: 1,
              transform: 'translateX(0%)',
            })
          ),
        ],
        {
          params: {
            delay: 0,
          },
        }
      ),
    ]),
    trigger('animateTopRight', [
      transition(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'translateX(10%) translateY(-10%) rotate(-5deg)',
          }),
          animate(
            '1s {{delay}}ms ease',
            style({
              opacity: 1,
              transform: 'translateX(0%) translateY(0%) rotate(0deg)',
            })
          ),
        ],
        {
          params: {
            delay: 0,
          },
        }
      ),
    ]),
    trigger('animateBottomRight', [
      transition(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'translateX(10%) translateY(10%) rotate(5deg)',
          }),
          animate(
            '1s {{delay}}ms ease',
            style({
              opacity: 1,
              transform: 'translateX(0%) translateY(0%) rotate(0)',
            })
          ),
        ],
        {
          params: {
            delay: 0,
          },
        }
      ),
    ]),
  ],
})
export class UserModalComponent implements OnInit {
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  editProfileForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
  });

  userProfiles: UserProfile[] = [];

  deletedUserIcon = faUserXmark;
  modifyUserIcon = faUserPen;

  editMode = false;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService
  ) {}

  updateData() {
    this.cancelEdit();
  }

  cancelEdit() {
    this.editMode = false;
    this.editProfileForm.reset();
  }

  onEditProfile() {
    if (this.user) {
      this.editMode = true;
      this.editProfileForm.patchValue({
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        username: this.user.username,
      });
    }
  }

  updateProfile() {
    if (this.editProfileForm.valid && this.user) {
      this.usersService
        .updateProfile(this.user.profileUniqueId, {
          firstname:
            this.editProfileForm.value.firstname || this.user.firstname,
          lastname: this.editProfileForm.value.lastname || this.user.lastname,
          username: this.editProfileForm.value.username || this.user.username,
        })
        .subscribe((profile) => {
          this.authService.updateUserProfile(profile);
          this.userProfiles = this.userProfiles.map((p) =>
            p.profileUniqueId === profile.profileUniqueId ? profile : p
          );
          this.notificationsService.push({
            type: NotificationType.Success,
            message: 'Votre profile à été mis à jour avec succès',
          });
          this.cancelEdit();
        });
    }
  }
  get user() {
    return this.authService.user;
  }

  ngOnInit(): void {
    this.usersService
      .getProfileList()
      .subscribe((profiles) => (this.userProfiles = profiles));
  }
}
