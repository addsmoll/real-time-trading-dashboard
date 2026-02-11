import { Injectable } from '@angular/core';
import { Observable, interval, merge, of } from 'rxjs';
import { map, switchMap, startWith, takeWhile, withLatestFrom } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { selectAllOffers } from '../state/session.selectors';

export interface SocketEvent {
  type: 'STATUS' | 'OFFER_UPDATED';
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class MockWsService {
  private sessionId: string | null = null;
  private connected = false;

  constructor(private store: Store) {}

  connect(sessionId: string): Observable<SocketEvent> {
    this.sessionId = sessionId;
    this.connected = true;

    const statusEvent: SocketEvent = { type: 'STATUS', payload: 'online' as const };

    const updates$ = interval(500).pipe(
      takeWhile(() => this.connected),
      withLatestFrom(this.store.pipe(select(selectAllOffers))),
      map(([_, offers]) => {
        const sessionOffers = offers.filter(o => o.id.toString().includes(sessionId));
        if (sessionOffers.length === 0) return null;
        const idx = Math.floor(Math.random() * sessionOffers.length);
        const offer = { ...sessionOffers[idx] };
        const delta = (Math.random() * 0.02 - 0.01) * offer.price;
        offer.price = parseFloat((Math.max(0, offer.price + delta)).toFixed(2));
        offer.updatedAt = new Date().toISOString();
        return { type: 'OFFER_UPDATED', payload: offer } as SocketEvent;
      }),

      switchMap(event => event ? of(event) : of())
    );
    return merge(of(statusEvent), updates$);
  }

  disconnect() {
    this.connected = false;
    this.sessionId = null;
  }
}
