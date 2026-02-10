import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'session',
    loadChildren: () =>
      import('./session/session.routes')
        .then(m => m.SESSION_ROUTES)
  }
];
