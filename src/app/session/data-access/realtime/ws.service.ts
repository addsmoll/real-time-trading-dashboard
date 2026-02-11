import { Injectable } from '@angular/core';
import { Observable, interval, merge, of } from 'rxjs';
import { map, filter, withLatestFrom, takeUntil, startWith } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { selectAllOffers } from '../state/session.selectors';

export interface SocketEvent {
  type: 'STATUS' | 'OFFER_UPDATED';
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class MockWsService {

  private connected = false;

  constructor(private store: Store) {}

  connect(sessionId: string): Observable<SocketEvent> {

    this.connected = true;


    const statusOnline$ = of({
      type: 'STATUS',
      payload: 'online'
    } as SocketEvent);

    const updates$ = interval(500).pipe(

      filter(() => this.connected),

      withLatestFrom(
        this.store.pipe(select(selectAllOffers))
      ),

      map(([_, offers]) => {

        const sessionOffers =
          offers.filter(o => o.id.toString().includes(sessionId));

        if (!sessionOffers.length) return null;

        const idx = Math.floor(Math.random() * sessionOffers.length);
        const offer = { ...sessionOffers[idx] };

        const delta =
          (Math.random() * 0.02 - 0.01) * offer.price;

        offer.price = Math.round(
          Math.max(0, offer.price + delta) * 100
        ) / 100;

        offer.updatedAt = new Date().toISOString();

        return {
          type: 'OFFER_UPDATED',
          payload: offer
        } as SocketEvent;
      }),

      filter(Boolean)
    );

    return merge(statusOnline$, updates$);
  }

  disconnect() {
    this.connected = false;
  }
}
