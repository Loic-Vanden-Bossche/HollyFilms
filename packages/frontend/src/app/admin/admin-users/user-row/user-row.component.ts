import { Component, Input } from '@angular/core';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-row',
  templateUrl: './user-row.component.html',
})
export class UserRowComponent {
  @Input() user: User | null = null;
}
