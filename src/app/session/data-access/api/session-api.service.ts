import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, of, switchMap} from 'rxjs';
import {Offer} from '../../models/offer.model';

@Injectable({ providedIn: 'root' })
export class SessionApiService {
  private http = inject(HttpClient);
  private url = 'api/sessions';
  private mockOffers: Offer[] = [
{ id: 1, product: `BTC for`, price: 40000, volume: 0.5,  updatedAt: '2025-01-01T10:00:00.000Z'},
{ id: 2, product: `ETH for`, price: 3000, volume: 2, updatedAt: '2025-01-01T10:00:00.000Z'},
{ id: 3, product: `SOL for`, price: 150, volume: 10, updatedAt: '2025-01-01T10:00:00.000Z'},

]
  getOffers(sessionId: string): Observable<Offer[]> {
    return this.http.get(`${this.url}/${sessionId}/oer`).pipe(
      map(() => {
        return this.mockOffers}),
      catchError(err => {
        return of(
          this.mockOffers
            .filter(o => o.id === +sessionId)
        );
      })
    );
  }
}
