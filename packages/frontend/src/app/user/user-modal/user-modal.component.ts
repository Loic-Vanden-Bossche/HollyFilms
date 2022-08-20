import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { faUserPen, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { NotificationsService } from '../../shared/services/notifications.service';
import { NotificationType } from '../../shared/models/notification.model';
import { UserProfile } from '../../shared/models/user-profile.model';
import { ModalService } from '../../shared/services/modal.service';

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

  insightsEntries: { value: string; label: string }[] = [];

  editProfileForm = new FormGroup({
    firstname: new FormControl('', Validators.pattern(/\S/)),
    lastname: new FormControl('', Validators.pattern(/\S/)),
    username: new FormControl('', Validators.pattern(/\S/)),
  });

  userProfiles: UserProfile[] = [];

  deletedUserIcon = faUserXmark;
  modifyUserIcon = faUserPen;

  editMode = false;

  get display(): boolean {
    return this.modalService.isDisplay('userModal') || false;
  }

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly modalService: ModalService,
    private readonly notificationsService: NotificationsService
  ) {}

  updateData() {
    this.updateInsights();
    this.cancelEdit();
  }

  cancelEdit() {
    this.editMode = false;
    this.editProfileForm.reset();
  }

  onDeleteProfile() {
    if (this.user && !this.user.isDefault) {
      this.usersService.deleteProfile().subscribe({
        next: () => {
          this.userProfiles = this.userProfiles.filter(
            (profile) => profile.profileUniqueId !== this.user?.profileUniqueId
          );

          this.notificationsService.push({
            type: NotificationType.Success,
            message: 'Votre profil a bien été supprimé',
          });
          const defaultProfile = this.userProfiles.find(
            (profile) => profile.isDefault
          );

          if (defaultProfile) {
            this.authService
              .switchUserProfile(defaultProfile.profileUniqueId)
              .subscribe(() => {
                this.notificationsService.push({
                  type: NotificationType.Neutral,
                  message:
                    'Vous êtes maintenant connecté avec votre profil par défaut',
                });
              });
          }
        },
        error: () => {
          this.notificationsService.push({
            type: NotificationType.Error,
            message:
              'Une erreur est survenue lors de la suppression de votre profil',
          });
        },
      });
    }
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

  fromSecondsToTime(seconds: number) {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m`;
    }

    return `${Math.floor(seconds / 3600)}h`;
  }

  updateInsights() {
    if (this.user) {
      this.usersService
        .getProfileInsights(this.user?.profileUniqueId)
        .subscribe((insights) => {
          this.insightsEntries = [
            {
              value: insights.watchedMedias.toString(),
              label:
                insights.watchedMedias === 1
                  ? 'film regardé'
                  : 'films regardés',
            },
            {
              value: this.fromSecondsToTime(insights.totalPlayTime),
              label: 'de visionnage',
            },
            {
              value: insights.favoriteGenre,
              label:
                insights.favoriteGenre === 'Aucun'
                  ? 'genre favori'
                  : 'est votre genre favori',
            },
          ];
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
        .subscribe({
          next: (profile) => {
            this.authService.updateUserProfile(profile);
            this.userProfiles = this.userProfiles.map((p) =>
              p.profileUniqueId === profile.profileUniqueId ? profile : p
            );
            this.notificationsService.push({
              type: NotificationType.Success,
              message: 'Votre profile à été mis à jour avec succès',
            });
            this.cancelEdit();
          },
          error: () => {
            this.notificationsService.push({
              type: NotificationType.Error,
              message:
                'Une erreur est survenue lors de la mise à jour de votre profile',
            });
          },
        });
    }
  }
  get user() {
    return this.authService.user;
  }

  ngOnInit(): void {
    this.updateInsights();
    this.usersService
      .getProfileList()
      .subscribe((profiles) => (this.userProfiles = profiles));
  }
}
