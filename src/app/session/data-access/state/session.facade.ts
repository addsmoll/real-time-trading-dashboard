import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectOffers, selectWsStatus} from './session.selectors';
import { Offer } from '../../models/offer.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionFacade {
  private store = inject(Store);
  offers$: Observable<Offer[]> = this.store.pipe(select(selectOffers));
  wsStatus$ = this.store.select(selectWsStatus);
}
