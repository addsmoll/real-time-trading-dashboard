import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';

import {
  map,
  filter,
  switchMap,
  catchError,
  EMPTY,
  tap,
  withLatestFrom
} from 'rxjs';

import { of } from 'rxjs';

import * as SessionActions from './session.actions';
import { SessionApiService } from '../api/session-api.service';
import { MockWsService, SocketEvent } from '../realtime/ws.service';
import { Offer } from '../../models/offer.model';

@Injectable()
export class SessionEffects {

  private actions$ = inject(Actions);
  private api = inject(SessionApiService);
  private ws = inject(MockWsService);

  routerEnterSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),

      map(action => {
        const params = (action.payload.routerState as any).params;
        return params?.['id'];
      }),

      filter((id): id is string => !!id),

      map(sessionId =>
        SessionActions.enterSession({ sessionId })
      )
    )
  );

  enterSession$ = createEffect(() =>
    this.actions$.pipe(

      ofType(SessionActions.enterSession),

      tap(() => {

        this.ws.disconnect();
      }),

      map(({ sessionId }) =>
        SessionActions.loadOffers({ offers: [] }) // optional loading state
      )
    )
  );


  loadOffers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionActions.enterSession),

      switchMap(({ sessionId }) =>
        this.api.getOffers(sessionId).pipe(

          map((offers: Offer[]) =>
            SessionActions.loadOffersSuccess({ offers })
          ),

          catchError(error =>
            of(SessionActions.loadOffersFailure({ error }))
          )
        )
      )
    )
  );

  connectWs$ = createEffect(() =>
    this.actions$.pipe(

      ofType(SessionActions.loadOffersSuccess),

      withLatestFrom(
        this.actions$.pipe(ofType(SessionActions.enterSession))
      ),

      switchMap(([_, enterAction]) =>
        this.ws.connect(enterAction.sessionId).pipe(

          map((event: SocketEvent) => {

            switch (event.type) {

              case 'STATUS':
                return SessionActions.wsStatusChanged({
                  status: event.payload
                });

              case 'OFFER_UPDATED':
                return SessionActions.offerUpdated({
                  offer: event.payload
                });

              default:
                return { type: '[WS] Unknown Event' };
            }

          }),

          catchError(() => EMPTY)
        )
      )
    )
  );

}
