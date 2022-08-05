import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as duration from 'dayjs/plugin/duration';
import * as dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');
dayjs.extend(duration);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
