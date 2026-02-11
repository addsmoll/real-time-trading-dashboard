import { Routes } from '@angular/router';

export const SESSION_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/session-page/session-page.component')
        .then(m => m.SessionPageComponent)
  }
];
