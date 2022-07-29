import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { PagesModule } from './pages/pages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NavigationModule } from './navigation/navigation.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { interceptors } from './api/interceptors';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    PagesModule,
    NotificationsModule,
    NavigationModule,
    AuthModule,
    AdminModule,
    FontAwesomeModule,
  ],
  providers: [interceptors],
  bootstrap: [AppComponent],
})
export class AppModule {}
