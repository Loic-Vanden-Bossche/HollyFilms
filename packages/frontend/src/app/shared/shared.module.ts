import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { UsersService } from './services/users.service';
import { ThemesService } from './services/themes.service';
import { PwaService } from './services/pwa.service';
import { NotificationsService } from './services/notifications.service';
import { ModalService } from './services/modal.service';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { LogoComponent } from './components/logo/logo.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SafePipe } from './pipes/safe.pipe';
import { RatingCircleComponent } from './components/rating-circle/rating-circle.component';
import { RatingBarComponent } from './components/rating-bar/rating-bar.component';
import { SentenceCasePipe } from './pipes/sentence-case.pipe';

@NgModule({
  declarations: [
    ModalComponent,
    LogoComponent,
    SafePipe,
    RatingCircleComponent,
    RatingBarComponent,
    SentenceCasePipe,
  ],
  exports: [
    ModalComponent,
    LogoComponent,
    SafePipe,
    RatingCircleComponent,
    RatingBarComponent,
    SentenceCasePipe,
  ],
  providers: [
    UsersService,
    ThemesService,
    PwaService,
    NotificationsService,
    ModalService,
    AuthService,
  ],
  imports: [CommonModule, HttpClientModule, FontAwesomeModule],
})
export class SharedModule {}
