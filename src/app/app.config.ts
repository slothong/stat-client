import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { baseUrlInterceptor } from './http-interceptors/base-url-interceptor';
import { authInterceptor } from './http-interceptors/auth-interceptor';
import { credentialInterceptor } from './http-interceptors/credential-interceptor';
import { registerLocaleData } from '@angular/common';
import ko from '@angular/common/locales/ko';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideSearch, lucideMail } from '@ng-icons/lucide';
import {
  heroBookmark,
  heroChatBubbleOvalLeft,
  heroEnvelope,
  heroHeart,
  heroKey,
  heroMinus,
  heroUser,
} from '@ng-icons/heroicons/outline';
import { heroBookmarkSolid, heroHeartSolid } from '@ng-icons/heroicons/solid';

registerLocaleData(ko);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        baseUrlInterceptor,
        authInterceptor,
        credentialInterceptor,
      ]),
    ),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideIcons({
      lucidePlus,
      lucideSearch,
      lucideMail,
      heroEnvelope,
      heroKey,
      heroHeart,
      heroHeartSolid,
      heroBookmark,
      heroBookmarkSolid,
      heroChatBubbleOvalLeft,
      heroMinus,
      heroUser,
    }),
  ],
};
