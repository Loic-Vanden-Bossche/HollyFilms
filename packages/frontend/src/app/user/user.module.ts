import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModalComponent } from './user-modal/user-modal.component';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [UserModalComponent],
  exports: [UserModalComponent],
  imports: [CommonModule, SharedModule, FontAwesomeModule],
})
export class UserModule {}
