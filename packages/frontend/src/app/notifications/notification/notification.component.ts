import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Notification,
  NotificationType,
} from '../../shared/models/notification.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', 'max-height': '0px' }),
        animate(
          '0.3s ease-out',
          style({ transform: 'translateY(0)', 'max-height': '100%' }),
        ),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('0.2s ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class NotificationComponent implements OnInit {
  @Input() notification: Notification | null = null;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() action: EventEmitter<number> = new EventEmitter<number>();

  typeClasses: string[] = [];

  animTrigger = true;
  hovered = false;

  ngOnInit() {
    this.resetTimer();
    this.typeClasses = this.classesFromTypes(
      this.notification?.type || NotificationType.Neutral,
    );
  }

  classesFromTypes(type: NotificationType): string[] {
    switch (type) {
      case 'success':
        return ['bg-success', 'text-black'];
      case 'error':
        return ['bg-error', 'text-black'];
      case 'warning':
        return ['bg-warning', 'text-black'];
      case 'info':
        return ['bg-info', 'text-black'];
      default:
        return ['bg-base-600', 'text-white'];
    }
  }

  resetTimer() {
    if (this.notification?.lifetime) {
      setTimeout(() => {
        if (!this.hovered) {
          this.closeNotification();
        } else {
          this.resetTimer();
        }
      }, this.notification.lifetime);
    }
  }

  type(type: string): boolean {
    return !!(this.notification && this.notification.type === type);
  }

  onAction(event: MouseEvent, index: number) {
    event.stopPropagation();
    event.preventDefault();
    this.action.emit(index);
    this.closeNotification();
  }

  closeNotification() {
    this.animTrigger = false;
    if (this.notification?.close) {
      this.notification.close();
    }
    this.close.emit();
  }
}
