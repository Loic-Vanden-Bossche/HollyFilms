import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModalComponent } from './user-modal/user-modal.component';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserProfileListComponent } from './user-modal/user-profile-list/user-profile-list.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserModalComponent, UserProfileListComponent],
  exports: [UserModalComponent],
  imports: [CommonModule, SharedModule, FontAwesomeModule, ReactiveFormsModule],
})
export class UserModule {}
