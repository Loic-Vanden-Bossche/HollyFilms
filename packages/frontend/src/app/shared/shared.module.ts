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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SafePipe } from './pipes/safe.pipe';
import { RatingCircleComponent } from './components/ratings/rating-circle/rating-circle.component';
import { RatingBarComponent } from './components/ratings/rating-bar/rating-bar.component';
import { SentenceCasePipe } from './pipes/sentence-case.pipe';
import { ProgressCircleComponent } from './components/progress-circle/progress-circle.component';
import { BytesToHumanPipe } from './pipes/bytes-to-human.pipe';
import { NoContentComponent } from './components/no-content/no-content.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    ModalComponent,
    SafePipe,
    RatingCircleComponent,
    RatingBarComponent,
    SentenceCasePipe,
    ProgressCircleComponent,
    BytesToHumanPipe,
    NoContentComponent,
    DropdownMenuComponent,
    LoaderComponent,
  ],
  exports: [
    ModalComponent,
    SafePipe,
    RatingCircleComponent,
    RatingBarComponent,
    SentenceCasePipe,
    ProgressCircleComponent,
    BytesToHumanPipe,
    NoContentComponent,
    DropdownMenuComponent,
    LoaderComponent,
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
