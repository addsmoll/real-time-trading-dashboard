import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, filter, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { of } from 'rxjs';

import * as SessionActions from './session.actions';
import { SessionApiService } from '../api/session-api.service';
import { MockWsService, SocketEvent } from '../realtime/ws.service';
import { Offer } from '../../models/offer.model';
import { routerNavigatedAction } from '@ngrx/router-store';

@Injectable()
export class SessionEffects {
  private actions$ = inject(Actions);
  private api = inject(SessionApiService);
  private ws = inject(MockWsService);
  private store = inject(Store);

  // ----------------------------------------
  // Router-driven enterSession
  // ----------------------------------------
  routerEnterSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(action => {
        const params = (action.payload.routerState as any).params;
        return params?.['id'];
      }),
      filter((id): id is string => !!id),
      map(sessionId => SessionActions.enterSession({ sessionId }))
    )
  );

  // ----------------------------------------
  // Load offers HTTP + connect WS
  // ----------------------------------------
  loadOffersAndWs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionActions.enterSession),
      switchMap(({ sessionId }) =>
        this.api.getOffers(sessionId).pipe(
          // сохраняем офферы в стор
          map((offers: Offer[]) => SessionActions.loadOffersSuccess({ offers })),
          catchError(error => of(SessionActions.loadOffersFailure({ error })))
        )
      )
    )
  );

  // ----------------------------------------
  // WS messages → store
  // ----------------------------------------
  wsMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionActions.enterSession),
      switchMap(({ sessionId }) =>
        this.ws.connect(sessionId).pipe(
          map((event: SocketEvent) => {
            switch (event.type) {
              case 'OFFER_UPDATED':
                return SessionActions.offerUpdated({ offer: event.payload });
              case 'STATUS':
                return SessionActions.wsStatusChanged({ status: event.payload });
              default:
                return { type: '[WS] Unknown Event' };
            }
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  // ----------------------------------------
  // Leave session → disconnect WS
  // ----------------------------------------
  leaveSession$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SessionActions.leaveSession),
        tap(() => this.ws.disconnect())
      ),
    { dispatch: false }
  );
}
