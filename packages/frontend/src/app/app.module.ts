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
import { PlayerComponent } from './player/player.component';
import { NgChartsModule } from 'ng2-charts';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, PlayerComponent],
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
    NgChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.serviceWorker,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [interceptors],
  bootstrap: [AppComponent],
})
export class AppModule {}
