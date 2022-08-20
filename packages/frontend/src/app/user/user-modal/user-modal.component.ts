import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { faUserPen, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';

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

  deletedUserIcon = faUserXmark;
  modifyUserIcon = faUserPen;

  editMode = false;

  constructor(private readonly authService: AuthService) {}

  get user() {
    return this.authService.user;
  }

  ngOnInit(): void {}
}
