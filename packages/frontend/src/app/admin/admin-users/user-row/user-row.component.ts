import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-row',
  templateUrl: './user-row.component.html',
})
export class UserRowComponent implements OnChanges {
  @ViewChild('userContent') userContent: ElementRef<HTMLDivElement> | null =
    null;
  @Input() user: User | null = null;
  @Output() userRefused = new EventEmitter<string>();
  @Output() userDeleted = new EventEmitter<string>();
  @Output() userValidated = new EventEmitter<string>();

  expanded = false;
  isUserAdmin = false;
  isUserActivated = false;

  currentStatus = '';
  statusColor = '';

  get contentHeight(): number {
    return this.userContent?.nativeElement.getBoundingClientRect().height || 0;
  }

  setCurrentStatus() {
    if (this.isUserAdmin) {
      this.statusColor = '#F87272';
      this.currentStatus = 'Administrateur';
      return;
    }

    if (!this.isUserActivated) {
      this.statusColor = '#FBBD23';
      this.currentStatus = 'Utilisateur inactif';
      return;
    }

    this.statusColor = '#36D399';
    this.currentStatus = 'Utilisateur actif';
  }

  ngOnChanges() {
    this.isUserActivated = this.user?.isActivated || false;
    this.isUserAdmin = this.user?.isAdmin || false;

    this.setCurrentStatus();
  }
}
