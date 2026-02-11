import { createAction, props } from '@ngrx/store';
import { Offer } from '../../models/offer.model';

export const enterSession = createAction(
  '[Session] Enter',
  props<{ sessionId: string }>()
);

export const leaveSession = createAction('[Session] Leave');

export const loadOffers = createAction(
  '[Session] Load Offers',
  props<{ offers: Offer[] }>()
);

export const loadOffersSuccess = createAction(
  '[Session] Load Offers Success',
  props<{ offers: Offer[] }>()
);

export const loadOffersFailure = createAction(
  '[Session] Load Offers Failure',
  props<{ error: any }>()
);

export const offerCreated = createAction(
  '[Session] Offer Created',
  props<{ offer: Offer }>()
);

export const offerUpdated = createAction(
  '[Session] Offer Updated',
  props<{ offer: Offer }>()
);

export const offerDeleted = createAction(
  '[Session] Offer Deleted',
  props<{ id: number }>()
);

export const wsStatusChanged = createAction(
  '[Session] WS Status Changed',
  props<{ status: 'online' | 'offline' }>()
);
