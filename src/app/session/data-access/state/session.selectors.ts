import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SessionState, adapter } from './session.reducer';

export const selectSessionState = createFeatureSelector<SessionState>('session');

export const selectOfferIds = createSelector(
  selectSessionState,
  state => state?.ids ?? []
);

export const selectOfferEntities = createSelector(
  selectSessionState,
  state => state?.entities ?? {}
);

export const selectOffers = createSelector(
  selectOfferIds,
  selectOfferEntities,
  (ids, entities) => ids.map(id => entities[id]!)
);

export const selectWsStatus = createSelector(
  selectSessionState,
  state => state?.wsStatus ?? 'offline'
);

const { selectAll } = adapter.getSelectors();

export const selectAllOffers = createSelector(
  selectSessionState,
  selectAll
);
