import { createReducer, on, Action } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as SessionActions from './session.actions';
import { Offer } from '../../models/offer.model';

export interface SessionState extends EntityState<Offer> {
  loading: boolean;
  error: any;
  wsStatus: 'online' | 'offline';
}

export const adapter = createEntityAdapter<Offer>();

export const initialState: SessionState = adapter.getInitialState({
  loading: false,
  error: null,
  wsStatus: 'offline'
});

export const sessionReducer = createReducer(
  initialState,

  on(SessionActions.loadOffers, (state, { offers }) =>
      adapter.setAll(offers, { ...state, loading: false })
  ),

  on(SessionActions.loadOffersSuccess, (state, { offers }) =>
    adapter.setAll(offers, { ...state, loading: false })
  ),

  on(SessionActions.loadOffersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(SessionActions.offerCreated, (state, { offer }) =>
    adapter.addOne(offer, state)
  ),

  on(SessionActions.offerUpdated, (state, { offer }) =>
    adapter.updateOne({ id: offer.id, changes: offer }, state)
  ),

  on(SessionActions.offerDeleted, (state, { id }) =>
    adapter.removeOne(id, state)
  ),

  on(SessionActions.wsStatusChanged, (state, { status }) => ({
    ...state,
    wsStatus: status
  }))
);

export function reducer(state: SessionState | undefined, action: Action) {
  return sessionReducer(state, action);
}
