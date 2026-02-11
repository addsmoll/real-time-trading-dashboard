import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {provideRouterStore, routerReducer} from '@ngrx/router-store';
import {CustomSerializer} from './core/store/router/custom.serializer';
import {provideEffects} from '@ngrx/effects';
import {SessionEffects} from './session/data-access/state/session.effects';
import {provideHttpClient} from '@angular/common/http';
import {sessionReducer} from './session/data-access/state/session.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    provideStore({ router: routerReducer,  session: sessionReducer }),
    provideStoreDevtools({
        maxAge: 25
    }),
    provideRouterStore({
      serializer: CustomSerializer
    }),
    provideEffects(SessionEffects)
  ]
};
